# StreamScope - CTV Cross-Platform Recommendation Engine

## 1. Project Overview

**Project Name**: StreamScope
**Type**: Full-stack web application (Frontend + Backend)
**Core Functionality**: A CTV viewing companion that generates detailed viewing reports and provides cross-platform recommendations by analyzing user's entire streaming history across Netflix, HBO Max, Hulu, Disney+, and Amazon Prime.
**Target Users**: CTV subscribers who want data-driven insights into their viewing habits and smarter recommendations.

---

## 2. Architecture

### Frontend
- **Technology**: Single-page HTML/CSS/JS (deployable to GitHub Pages)
- **Design**: Apple-inspired light theme with clean, professional aesthetic
- **Features**: Interactive dashboard, animated charts, clickable recommendations

### Backend
- **Technology**: Python + FastAPI
- **Database**: SQLite (simple, file-based, no setup required)
- **API**: RESTful JSON endpoints
- **Deployment**: GitHub Actions + Container

---

## 3. Visual & UI Specification

### Color Palette (Apple-Inspired Light Theme)
- **Background**: `#ffffff`, `#f5f5f7`
- **Surface**: `#ffffff`
- **Primary**: `#0071e3` (Apple Blue)
- **Secondary**: `#34c759` (Success Green)
- **Accent**: `#ff9500` (Orange)
- **Text Primary**: `#1d1d1f`
- **Text Secondary**: `#86868b`

### Typography
- **Font Family**: SF Pro Display, SF Pro Text (system fonts)
- **Headings**: SF Pro Display, bold
- **Body**: SF Pro Text, regular
- **Data/Metrics**: SF Mono (monospace)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR: Logo + User + Connected Services + Stats     │
├─────────────────────────────────────────────────────────┤
│  HEADER: Navigation Tabs + Last Synced                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  MAIN CONTENT AREA                                      │
│  - Dashboard View (default)                             │
│  - Reports View                                          │
│  - Discover View (clickable recommendations)             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Navigation Tabs
1. **Dashboard** - Overview metrics
2. **Reports** - Detailed viewing reports
3. **Discover** - Cross-platform recommendations with direct links

---

## 4. Feature Specifications

### 4.1 Dashboard View
- **Total Watch Time**: Large metric card with hours/minutes
- **Connected Platforms**: Sidebar showing synced streaming services
- **Top Categories**: Donut chart with percentages
- **Weekly Trend**: Bar chart showing last 7 days viewing
- **Platform Breakdown**: Horizontal bars per platform
- **Top Actors**: Ranked list with watch hours

### 4.2 Reports System
- **Time Period Selector**: Weekly / Monthly / All Time
- **Category Breakdown**: Animated progress bars
- **Actor Analysis**: Top actors with watch time
- **Director Insights**: Top directors
- **Peak Viewing Times**: Heat map of hours vs days

### 4.3 Cross-Platform Recommendations
- **Algorithm**: Content-based filtering hybrid
- **Input**: Combined viewing history from all platforms
- **Output**: Ranked list of shows/movies with match percentage
- **Clickable Links**: Direct URLs to streaming platform pages
- **Reason Cards**: "Because you watched X", "Your favorite actor Y is in this"
- **Platform Badges**: Which platforms have the recommended content
- **Similarity Score**: 0-100% match indicator
- **Watch CTA**: "Watch on [Platform]" button linking to real URLs

---

## 5. Data Models

### User
```json
{
  "id": "user_001",
  "name": "Chloe",
  "platforms": ["netflix", "hbo_max", "hulu", "disney_plus", "prime"],
  "created_at": "2024-01-15T00:00:00Z"
}
```

### ViewingHistory
```json
{
  "id": "view_001",
  "user_id": "user_001",
  "title": "Stranger Things",
  "platform": "netflix",
  "category": "Sci-Fi",
  "actors": ["Millie Bobby Brown", "Finn Wolfhard"],
  "director": "The Duffer Brothers",
  "watch_duration_minutes": 720,
  "completed": true,
  "watched_at": "2024-03-15T20:00:00Z"
}
```

### Report
```json
{
  "user_id": "user_001",
  "period": "monthly",
  "start_date": "2024-03-01",
  "end_date": "2024-03-31",
  "total_watch_time_minutes": 4320,
  "total_episodes": 45,
  "top_categories": [{"name": "Sci-Fi", "percentage": 35, "watch_time_minutes": 1512}],
  "top_actors": [{"name": "Millie Bobby Brown", "hours": 12, "appearances": 3}],
  "top_directors": [{"name": "The Duffer Brothers", "hours": 24}],
  "platform_breakdown": [{"platform": "netflix", "percentage": 45, "watch_time_minutes": 1944}],
  "peak_hours": {"21:00": 45, "22:00": 38},
  "binge_sessions": 8
}
```

### Recommendation
```json
{
  "title": "Dark",
  "platform": "netflix",
  "match_score": 87,
  "reason": "Because you love Stranger Things and Sci-Fi content",
  "category": "Sci-Fi",
  "actors": ["Louis Hofmann", "Johannes Krischan"],
  "director": "Baran bo Odar",
  "year": 2017,
  "description": "A missing child, a hidden time machine...",
  "url": "https://www.netflix.com/title/80238110"
}
```

---

## 6. API Endpoints

### User
- `GET /api/user/{user_id}` - Get user profile
- `POST /api/user` - Create user
- `PUT /api/user/{user_id}/platforms` - Update subscribed platforms

### Viewing History
- `GET /api/user/{user_id}/history` - Get viewing history
- `POST /api/user/{user_id}/history` - Add viewing entry
- `DELETE /api/user/{user_id}/history/{entry_id}` - Remove entry

### Reports
- `GET /api/user/{user_id}/reports?period=weekly|monthly|all` - Generate report

### Recommendations
- `GET /api/user/{user_id}/recommendations?limit=10` - Get recommendations
- `POST /api/user/{user_id}/recommendations/refresh` - Force refresh

### Health
- `GET /api/health` - Health check

---

## 7. Mock Data (Demo Mode)

Pre-populated with realistic viewing data:
- 35+ viewing entries across Netflix, HBO Max, Hulu, Disney+, Prime Video
- 10 categories (Sci-Fi, Drama, Comedy, Action, Thriller, Documentary, etc.)
- 20+ actors
- 30 days of history

Recommendations include real platform URLs for direct linking.

---

## 8. File Structure

```
streamscope/
├── frontend/
│   ├── index.html          # Main SPA
│   ├── css/
│   │   └── styles.css     # Apple-inspired styles
│   └── js/
│       ├── app.js          # Main application logic
│       ├── api.js          # API client + mock fallback
│       ├── charts.js       # SVG chart rendering
│       └── data.js         # Mock data + platform URLs
├── backend/
│   ├── main.py             # FastAPI application
│   ├── models.py           # Pydantic models
│   ├── database.py         # SQLite operations
│   ├── recommendation.py    # Recommendation engine
│   ├── seed_data.py        # Demo data seeder
│   └── requirements.txt    # Python dependencies
├── docker-compose.yml      # Container orchestration
├── Dockerfile              # Backend container
├── .github/
│   └── workflows/
│       ├── deploy.yml      # CI/CD pipeline
│       └── pages.yml        # GitHub Pages deployment
├── SPEC.md                 # This specification
└── README.md               # Project documentation
```

---

## 9. Acceptance Criteria

1. **Dashboard**: Shows overview with animated charts and metrics
2. **Reports**: Generates weekly/monthly reports with category/actor analysis
3. **Recommendations**: Cross-platform suggestions with clickable URLs
4. **UI**: Fully functional HTML demo with Apple-inspired light theme
5. **Backend**: FastAPI server with SQLite database
6. **Deployment**: GitHub-ready with Docker and Actions

---

## 10. Platform Integration

The application simulates streaming platform integration with:
- Mock viewing history from 5 platforms
- Real recommendation URLs for Netflix, HBO Max, Hulu, Disney+, Prime Video
- Sync simulation (in production, would use OAuth + platform APIs)

### Future Integration Points
- Netflix: Netflix Data API (partner program)
- HBO Max: Warner Bros. Discovery API
- Hulu: Disney Streaming Partner API
- Disney+: Disney Streaming Partner API
- Prime Video: Amazon Associate API
