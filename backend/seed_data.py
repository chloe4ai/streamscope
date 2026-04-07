"""
Seed script to populate the database with realistic mock viewing data.
Run this once to set up demo data.
"""
import random
import uuid
from datetime import datetime, timedelta
from models import User, ViewingHistory, Platform, Category
from database import init_db, create_user, add_viewing_entry, get_user

DEMO_USER_ID = "demo_user_001"

PLATFORMS = [Platform.NETFLIX, Platform.HBO_MAX, Platform.HULU, Platform.DISNEY_PLUS, Platform.PRIME]

VIEWING_DATA = [
    # Stranger Things (Sci-Fi, Netflix)
    {"title": "Stranger Things", "platform": Platform.NETFLIX, "category": Category.SCIFI, "actors": ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour", "Winona Ryder"], "director": "The Duffer Brothers", "duration": 720},
    {"title": "Stranger Things", "platform": Platform.NETFLIX, "category": Category.SCIFI, "actors": ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"], "director": "The Duffer Brothers", "duration": 680},
    {"title": "Stranger Things", "platform": Platform.NETFLIX, "category": Category.SCIFI, "actors": ["Millie Bobby Brown", "Gaten Matarazzo"], "director": "The Duffer Brothers", "duration": 650},

    # The Bear (Drama, Hulu)
    {"title": "The Bear", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"], "director": "Christopher Storer", "duration": 180},
    {"title": "The Bear", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Jeremy Allen White", "Ayo Edebiri"], "director": "Christopher Storer", "duration": 200},
    {"title": "The Bear", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Jeremy Allen White", "Lionel Boyce"], "director": "Christopher Storer", "duration": 190},

    # Succession (Drama, HBO Max)
    {"title": "Succession", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Brian Cox", "Jeremy Strong", "Sarah Snook", "Kieran Culkin"], "director": "Jesse Armstrong", "duration": 420},
    {"title": "Succession", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Jeremy Strong", "Sarah Snook"], "director": "Jesse Armstrong", "duration": 380},
    {"title": "Succession", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Brian Cox", "Kieran Culkin"], "director": "Jesse Armstrong", "duration": 400},

    # The Last of Us (Drama, HBO Max)
    {"title": "The Last of Us", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Pedro Pascal", "Bella Ramsey"], "director": "Craig Mazin", "duration": 520},
    {"title": "The Last of Us", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna"], "director": "Craig Mazin", "duration": 480},

    # Severance (Sci-Fi, Apple TV - mapped to streaming)
    {"title": "Severance", "platform": Platform.HBO_MAX, "category": Category.SCIFI, "actors": ["Adam Scott", "Zach Cherry", "Britt Lower"], "director": "Dan Erickson", "duration": 340},
    {"title": "Severance", "platform": Platform.HBO_MAX, "category": Category.SCIFI, "actors": ["Adam Scott", "Patricia Arquette"], "director": "Dan Erickson", "duration": 360},

    # The Crown (Drama, Netflix)
    {"title": "The Crown", "platform": Platform.NETFLIX, "category": Category.DRAMA, "actors": ["Claire Foy", "Olivia Colman", "Imelda Staunton"], "director": "Peter Morgan", "duration": 480},
    {"title": "The Crown", "platform": Platform.NETFLIX, "category": Category.DRAMA, "actors": ["Olivia Colman", " Tobias Menzies"], "director": "Peter Morgan", "duration": 450},

    # Reacher (Action, Prime)
    {"title": "Reacher", "platform": Platform.PRIME, "category": Category.ACTION, "actors": ["Alan Ritchson", "Malcolm Goodwin"], "director": "Nick Santora", "duration": 380},
    {"title": "Reacher", "platform": Platform.PRIME, "category": Category.ACTION, "actors": ["Alan Ritchson"], "director": "Nick Santora", "duration": 400},

    # Andor (Sci-Fi, Disney+)
    {"title": "Andor", "platform": Platform.DISNEY_PLUS, "category": Category.SCIFI, "actors": ["Diego Luna", "Genevieve O'Reilly"], "director": "Tony Gilroy", "duration": 300},
    {"title": "Andor", "platform": Platform.DISNEY_PLUS, "category": Category.SCIFI, "actors": ["Diego Luna"], "director": "Tony Gilroy", "duration": 320},

    # House of the Dragon (Fantasy, HBO Max)
    {"title": "House of the Dragon", "platform": Platform.HBO_MAX, "category": Category.FANTASY, "actors": ["Matt Smith", "Emma D'Arcy", "Olivia Cooke"], "director": "Ryan Condal", "duration": 420},
    {"title": "House of the Dragon", "platform": Platform.HBO_MAX, "category": Category.FANTASY, "actors": ["Matt Smith", "Paddy Considine"], "director": "Ryan Condal", "duration": 440},

    # Beef (Comedy, Netflix)
    {"title": "Beef", "platform": Platform.NETFLIX, "category": Category.COMEDY, "actors": ["Steven Yeun", "Ali Wong"], "director": "Lee Sung Jin", "duration": 280},
    {"title": "Beef", "platform": Platform.NETFLIX, "category": Category.COMEDY, "actors": ["Steven Yeun", "Ali Wong", "Adele Lim"], "director": "Lee Sung Jin", "duration": 300},

    # Shogun (Drama, Hulu)
    {"title": "Shogun", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"], "director": "Rachel Kondo", "duration": 350},
    {"title": "Shogun", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Hiroyuki Sanada"], "director": "Rachel Kondo", "duration": 340},

    # Ripley (Thriller, Netflix)
    {"title": "Ripley", "platform": Platform.NETFLIX, "category": Category.THRILLER, "actors": ["Andrew Scott", "Johnny Flynn", "Dakota Fanning"], "director": "Steven Zaillian", "duration": 300},

    # Fall asleep documentaries
    {"title": "Our Planet", "platform": Platform.NETFLIX, "category": Category.DOCUMENTARY, "actors": ["David Attenborough"], "director": "Alastair Fothergill", "duration": 300},
    {"title": "Planet Earth III", "platform": Platform.BBC, "category": Category.DOCUMENTARY, "actors": ["David Attenborough"], "director": "Mike Birtwistle", "duration": 280},

    # Some comedy
    {"title": "The Great", "platform": Platform.HULU, "category": Category.COMEDY, "actors": ["Elle Fanning", "Nicholas Hoult"], "director": "Tony McNamara", "duration": 240},
    {"title": "What We Do in the Shadows", "platform": Platform.HULU, "category": Category.COMEDY, "actors": ["Matt Berry", "Kayvan Novak", "Natasia Demetriou"], "director": "Jemaine Clement", "duration": 200},

    # Some action
    {"title": "The Gentlemen", "platform": Platform.NETFLIX, "category": Category.ACTION, "actors": ["Theo James", "Michele Hicks"], "director": "Guy Ritchie", "duration": 260},

    # More Netflix drama
    {"title": "Wednesday", "platform": Platform.NETFLIX, "category": Category.COMEDY, "actors": ["Jenna Ortega", "Catherine Zeta-Jones"], "director": "Tim Burton", "duration": 480},
    {"title": "Bridgerton", "platform": Platform.NETFLIX, "category": Category.ROMANCE, "actors": ["Nicola Coughlan", "Jonathan Bailey"], "director": "Chris Van Dusen", "duration": 360},

    # More HBO
    {"title": "The Whites", "platform": Platform.HBO_MAX, "category": Category.THRILLER, "actors": ["Oscar Isaac", "Carey Mulligan"], "director": "Benito Montaño", "duration": 380},

    # Prime thriller
    {"title": "Fallout", "platform": Platform.PRIME, "category": Category.SCIFI, "actors": ["Ella Purnell", "Aaron Stafford", "Kyle MacLachlan"], "director": "Jonathan Nolan", "duration": 420},
]


def seed_demo_user():
    """Create demo user and populate with viewing history."""
    # Create user
    demo_user = User(
        id=DEMO_USER_ID,
        name="Chloe",
        platforms=PLATFORMS,
        created_at=datetime.utcnow() - timedelta(days=90)
    )

    # Check if user already exists
    existing = get_user(DEMO_USER_ID)
    if existing:
        print(f"Demo user already exists. Clearing history...")
        from database import clear_user_history
        clear_user_history(DEMO_USER_ID)

    create_user(demo_user)
    print(f"Created demo user: {demo_user.name}")

    # Add viewing history with spread out dates
    now = datetime.utcnow()

    for i, data in enumerate(VIEWING_DATA):
        # Spread entries over the past 60 days
        days_ago = random.randint(1, 60)
        hours_ago = random.randint(0, 23)
        watched_at = now - timedelta(days=days_ago, hours=hours_ago)

        entry = ViewingHistory(
            id=str(uuid.uuid4()),
            user_id=DEMO_USER_ID,
            title=data["title"],
            platform=data["platform"],
            category=data["category"],
            actors=data["actors"],
            director=data["director"],
            watch_duration_minutes=data["duration"],
            completed=random.random() > 0.1,  # 90% completion rate
            watched_at=watched_at
        )

        add_viewing_entry(entry)

    print(f"Added {len(VIEWING_DATA)} viewing entries to history")


if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Seeding demo data...")
    seed_demo_user()
    print("Done! Demo user is ready at /api/user/demo_user_001")
