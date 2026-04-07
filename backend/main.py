from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from models import (
    User, ViewingHistory, Report, Recommendation,
    Platform, Category, CategoryBreakdown, ActorInsight,
    PlatformBreakdown, AddViewingRequest
)
from database import (
    init_db, create_user, get_user, update_user_platforms,
    add_viewing_entry, get_viewing_history, delete_viewing_entry,
    clear_user_history
)
from recommendation import generate_recommendations

app = FastAPI(title="StreamScope API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
init_db()


# ============ Health Check ============

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "StreamScope API"}


# ============ User Endpoints ============

@app.get("/api/user/{user_id}")
def get_user_profile(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/api/user")
def create_user_endpoint(user: User):
    existing = get_user(user.id)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    return create_user(user)


@app.put("/api/user/{user_id}/platforms")
def update_platforms(user_id: str, platforms: List[Platform]):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return update_user_platforms(user_id, platforms)


# ============ Viewing History Endpoints ============

@app.get("/api/user/{user_id}/history")
def get_history(user_id: str, limit: Optional[int] = None):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_viewing_history(user_id, limit)


@app.post("/api/user/{user_id}/history")
def add_history_entry(user_id: str, entry: AddViewingRequest):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    viewing = ViewingHistory(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=entry.title,
        platform=entry.platform,
        category=entry.category,
        actors=entry.actors,
        director=entry.director,
        watch_duration_minutes=entry.watch_duration_minutes,
        completed=entry.completed,
        watched_at=datetime.utcnow()
    )

    return add_viewing_entry(viewing)


@app.delete("/api/user/{user_id}/history/{entry_id}")
def delete_history_entry(user_id: str, entry_id: str):
    deleted = delete_viewing_entry(user_id, entry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"success": True, "deleted": entry_id}


@app.delete("/api/user/{user_id}/history")
def clear_history(user_id: str):
    clear_user_history(user_id)
    return {"success": True, "message": "History cleared"}


# ============ Reports Endpoints ============

@app.get("/api/user/{user_id}/reports")
def get_report(user_id: str, period: str = "monthly"):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = get_viewing_history(user_id)

    if not history:
        raise HTTPException(status_code=404, detail="No viewing history found")

    # Filter by period
    now = datetime.utcnow()
    if period == "weekly":
        start_date = now - timedelta(days=7)
    elif period == "monthly":
        start_date = now - timedelta(days=30)
    else:  # all
        start_date = datetime(2000, 1, 1)

    filtered_history = [
        h for h in history
        if h.watched_at >= start_date
    ]

    if not filtered_history:
        raise HTTPException(status_code=404, detail=f"No viewing data for period: {period}")

    # Calculate report metrics
    total_watch_time = sum(h.watch_duration_minutes for h in filtered_history)
    total_episodes = len(filtered_history)

    # Category breakdown
    category_times = {}
    for h in filtered_history:
        cat = h.category.value
        category_times[cat] = category_times.get(cat, 0) + h.watch_duration_minutes

    total_category_time = sum(category_times.values())
    top_categories = [
        CategoryBreakdown(
            name=cat,
            percentage=round((mins / total_category_time) * 100, 1),
            watch_time_minutes=mins
        )
        for cat, mins in sorted(category_times.items(), key=lambda x: x[1], reverse=True)[:5]
    ]

    # Actor breakdown
    actor_times = {}
    for h in filtered_history:
        for actor in h.actors:
            actor_times[actor] = actor_times.get(actor, 0) + h.watch_duration_minutes

    top_actors = [
        ActorInsight(
            name=actor,
            hours=round(mins / 60, 1),
            appearances=sum(1 for h in filtered_history if actor in h.actors)
        )
        for actor, mins in sorted(actor_times.items(), key=lambda x: x[1], reverse=True)[:10]
    ]

    # Director breakdown
    director_times = {}
    for h in filtered_history:
        director_times[h.director] = director_times.get(h.director, 0) + h.watch_duration_minutes

    top_directors = [
        {"name": d, "hours": round(mins / 60, 1)}
        for d, mins in sorted(director_times.items(), key=lambda x: x[1], reverse=True)[:5]
    ]

    # Platform breakdown
    platform_times = {}
    for h in filtered_history:
        plat = h.platform.value
        platform_times[plat] = platform_times.get(plat, 0) + h.watch_duration_minutes

    platform_breakdown = [
        PlatformBreakdown(
            platform=plat,
            percentage=round((mins / total_watch_time) * 100, 1),
            watch_time_minutes=mins
        )
        for plat, mins in sorted(platform_times.items(), key=lambda x: x[1], reverse=True)
    ]

    # Peak hours
    hour_counts = {}
    for h in filtered_history:
        hour = h.watched_at.strftime("%H:00")
        hour_counts[hour] = hour_counts.get(hour, 0) + 1

    # Binge sessions (consecutive days with 3+ hours)
    binge_sessions = 0
    dates_with_binge = set()
    for h in filtered_history:
        if h.watch_duration_minutes >= 180:
            date_key = h.watched_at.date()
            if date_key not in dates_with_binge:
                binge_sessions += 1
                dates_with_binge.add(date_key)

    report = Report(
        user_id=user_id,
        period=period,
        start_date=start_date.isoformat(),
        end_date=now.isoformat(),
        total_watch_time_minutes=total_watch_time,
        total_episodes=total_episodes,
        top_categories=top_categories,
        top_actors=top_actors,
        top_directors=top_directors,
        platform_breakdown=platform_breakdown,
        peak_hours=hour_counts,
        binge_sessions=binge_sessions
    )

    return report


# ============ Recommendations Endpoints ============

@app.get("/api/user/{user_id}/recommendations")
def get_recommendations(user_id: str, limit: int = 10):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = get_viewing_history(user_id)
    recommendations = generate_recommendations(history, user.platforms, limit)
    return recommendations


@app.post("/api/user/{user_id}/recommendations/refresh")
def refresh_recommendations(user_id: str, limit: int = 10):
    # In a real system, this would trigger a background job
    return get_recommendations(user_id, limit)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
