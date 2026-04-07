from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


class Platform(str, Enum):
    NETFLIX = "netflix"
    HBO_MAX = "hbo_max"
    HULU = "hulu"
    DISNEY_PLUS = "disney_plus"
    PRIME = "prime"


class Category(str, Enum):
    DRAMA = "Drama"
    COMEDY = "Comedy"
    ACTION = "Action"
    DOCUMENTARY = "Documentary"
    THRILLER = "Thriller"
    SCIFI = "Sci-Fi"
    ROMANCE = "Romance"
    HORROR = "Horror"
    ANIMATION = "Animation"
    KIDS = "Kids"


class User(BaseModel):
    id: str
    name: str
    platforms: List[Platform]
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ViewingHistory(BaseModel):
    id: str
    user_id: str
    title: str
    platform: Platform
    category: Category
    actors: List[str]
    director: str
    watch_duration_minutes: int
    completed: bool = False
    watched_at: datetime = Field(default_factory=datetime.utcnow)


class CategoryBreakdown(BaseModel):
    name: str
    percentage: float
    watch_time_minutes: int


class ActorInsight(BaseModel):
    name: str
    hours: float
    appearances: int


class PlatformBreakdown(BaseModel):
    platform: str
    percentage: float
    watch_time_minutes: int


class Report(BaseModel):
    user_id: str
    period: str
    start_date: str
    end_date: str
    total_watch_time_minutes: int
    total_episodes: int
    top_categories: List[CategoryBreakdown]
    top_actors: List[ActorInsight]
    top_directors: List[Dict[str, any]]
    platform_breakdown: List[PlatformBreakdown]
    peak_hours: Dict[str, int]
    binge_sessions: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class Recommendation(BaseModel):
    title: str
    platform: Platform
    match_score: float
    reason: str
    category: Category
    actors: List[str]
    director: str
    year: int
    description: str
    poster_url: str = ""


class AddViewingRequest(BaseModel):
    title: str
    platform: Platform
    category: Category
    actors: List[str]
    director: str
    watch_duration_minutes: int
    completed: bool = False
