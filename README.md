# StreamScope

**CTV Cross-Platform Recommendation Engine**

A sophisticated viewing analytics and recommendation platform that unifies your streaming history across Netflix, HBO Max, Hulu, Disney+, and Prime Video into one powerful dashboard.

![StreamScope Dashboard](https://via.placeholder.com/1200x630?text=StreamScope+Dashboard)

## Features

### 📊 Dashboard
- Real-time viewing metrics across all platforms
- Category distribution with animated donut charts
- Weekly viewing trends
- Platform breakdown analysis
- Top actors by watch time

### 📈 Reports
- Weekly, monthly, and all-time reporting
- Deep-dive category analysis
- Director insights
- Peak viewing time heatmaps
- Binge session tracking

### 🎯 Discover
- AI-powered cross-platform recommendations
- Clickable links directly to streaming platforms
- Match percentage scoring
- Personalized "Because you watched..." reasoning

## Quick Start

### Demo Mode (No Setup Required)

Open `frontend/index.html` directly in your browser to explore the full demo with mock data.

### With Backend

```bash
# Clone the repository
git clone https://github.com/chloetan/streamscope.git
cd streamscope

# Start with Docker Compose
docker-compose up

# Or run backend directly
cd backend
pip install -r requirements.txt
python seed_data.py
uvicorn main:app --reload
```

Access the app at `http://localhost:3000` (frontend) and `http://localhost:8000` (API).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (SPA)                         │
│    HTML/CSS/JS - Apple-inspired design, animated charts    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                        │
│  REST API • SQLite • Recommendation Engine • Mock Data     │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3 (Custom Properties), Vanilla JavaScript |
| Backend | Python 3.11+, FastAPI |
| Database | SQLite |
| Charts | Custom SVG with CSS animations |
| Container | Docker, Docker Compose |

## Project Structure

```
streamscope/
├── frontend/           # Single-page application
│   ├── index.html     # Main HTML
│   ├── css/styles.css # Styles
│   └── js/            # Application scripts
├── backend/           # Python FastAPI server
│   ├── main.py        # API endpoints
│   ├── models.py      # Data models
│   ├── database.py    # SQLite operations
│   └── recommendation.py
├── docker-compose.yml
├── Dockerfile
└── .github/workflows/ # CI/CD
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/user/{id}` | Get user profile |
| `GET` | `/api/user/{id}/history` | Get viewing history |
| `GET` | `/api/user/{id}/reports` | Generate report |
| `GET` | `/api/user/{id}/recommendations` | Get recommendations |

## Deployment

### GitHub Pages (Frontend)

The frontend deploys automatically via GitHub Actions on push to `main`.

### Docker (Backend)

```bash
# Build image
docker build -t streamscope-backend ./backend

# Run container
docker run -p 8000:8000 streamscope-backend
```

## Platform Integration

Currently in demo mode with mock data simulating:
- Netflix
- HBO Max
- Hulu
- Disney+
- Prime Video

**Future integrations** will use official platform APIs:
- Netflix Data API (Partner Program)
- Warner Bros. Discovery API
- Disney Streaming Partner API
- Amazon Associate API

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#0071e3` | Buttons, links, accents |
| Secondary | `#34c759` | Success states, connected indicators |
| Background | `#ffffff`, `#f5f5f7` | Page background |

### Typography

- **Display**: SF Pro Display (system)
- **Body**: SF Pro Text (system)
- **Monospace**: SF Mono (metrics, data)

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with precision by **Chloe Tan**
