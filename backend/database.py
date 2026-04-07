import sqlite3
import json
from pathlib import Path
from datetime import datetime
from typing import List, Optional
from models import User, ViewingHistory, Platform, Category

DATABASE_PATH = Path(__file__).parent / "streamscope.db"


def get_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            platforms TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS viewing_history (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            platform TEXT NOT NULL,
            category TEXT NOT NULL,
            actors TEXT NOT NULL,
            director TEXT NOT NULL,
            watch_duration_minutes INTEGER NOT NULL,
            completed INTEGER DEFAULT 0,
            watched_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    cursor.execute("""
        CREATE INDEX IF NOT EXISTS idx_viewing_user ON viewing_history(user_id)
    """)

    conn.commit()
    conn.close()


def create_user(user: User) -> User:
    conn = get_connection()
    cursor = conn.cursor()

    platforms_json = json.dumps([p.value for p in user.platforms])

    cursor.execute(
        "INSERT INTO users (id, name, platforms, created_at) VALUES (?, ?, ?, ?)",
        (user.id, user.name, platforms_json, user.created_at.isoformat())
    )

    conn.commit()
    conn.close()
    return user


def get_user(user_id: str) -> Optional[User]:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    platforms = [Platform(p) for p in json.loads(row["platforms"])]
    return User(
        id=row["id"],
        name=row["name"],
        platforms=platforms,
        created_at=datetime.fromisoformat(row["created_at"])
    )


def update_user_platforms(user_id: str, platforms: List[Platform]) -> Optional[User]:
    conn = get_connection()
    cursor = conn.cursor()

    platforms_json = json.dumps([p.value for p in platforms])
    cursor.execute(
        "UPDATE users SET platforms = ? WHERE id = ?",
        (platforms_json, user_id)
    )

    conn.commit()
    conn.close()

    return get_user(user_id)


def add_viewing_entry(entry: ViewingHistory) -> ViewingHistory:
    conn = get_connection()
    cursor = conn.cursor()

    actors_json = json.dumps(entry.actors)

    cursor.execute(
        """INSERT INTO viewing_history
           (id, user_id, title, platform, category, actors, director, watch_duration_minutes, completed, watched_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            entry.id,
            entry.user_id,
            entry.title,
            entry.platform.value,
            entry.category.value,
            actors_json,
            entry.director,
            entry.watch_duration_minutes,
            1 if entry.completed else 0,
            entry.watched_at.isoformat()
        )
    )

    conn.commit()
    conn.close()
    return entry


def get_viewing_history(user_id: str, limit: Optional[int] = None) -> List[ViewingHistory]:
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM viewing_history WHERE user_id = ? ORDER BY watched_at DESC"
    if limit:
        query += f" LIMIT {limit}"

    cursor.execute(query, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    entries = []
    for row in rows:
        entries.append(ViewingHistory(
            id=row["id"],
            user_id=row["user_id"],
            title=row["title"],
            platform=Platform(row["platform"]),
            category=Category(row["category"]),
            actors=json.loads(row["actors"]),
            director=row["director"],
            watch_duration_minutes=row["watch_duration_minutes"],
            completed=bool(row["completed"]),
            watched_at=datetime.fromisoformat(row["watched_at"])
        ))

    return entries


def delete_viewing_entry(user_id: str, entry_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM viewing_history WHERE id = ? AND user_id = ?",
        (entry_id, user_id)
    )

    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted


def clear_user_history(user_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM viewing_history WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
