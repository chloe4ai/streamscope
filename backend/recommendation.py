import random
from typing import List, Dict, Tuple
from models import ViewingHistory, Recommendation, Platform, Category

# Content catalog for recommendations (simulated cross-platform library)
CONTENT_CATALOG = [
    {"title": "Dark", "platform": Platform.NETFLIX, "category": Category.SCIFI, "actors": ["Louis Hofmann", "Johannes Krischan"], "director": "Baran bo Odar", "year": 2017, "description": "A missing child, a hidden time machine, and a small town with dark secrets.", "similar_to": ["Stranger Things", "Westworld"]},
    {"title": "The Crown", "platform": Platform.NETFLIX, "category": Category.DRAMA, "actors": ["Claire Foy", "Olivia Colman", "Imelda Staunton"], "director": "Peter Morgan", "year": 2016, "description": "The reign of Queen Elizabeth II, from her wedding to her death.", "similar_to": ["The Crown", "Downton Abbey"]},
    {"title": "Succession", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Brian Cox", "Jeremy Strong", "Sarah Snook"], "director": "Jesse Armstrong", "year": 2018, "description": "A media dynasty unravels as the patriarch plans his succession.", "similar_to": ["Billions", "Empire"]},
    {"title": "The Bear", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Jeremy Allen White", "Ayo Edebiri", "Ebon Moss-Bachrach"], "director": "Christopher Storer", "year": 2022, "description": "A young chef returns to his family's Chicago sandwich shop.", "similar_to": ["Kitchen Confidential", "Chef's Table"]},
    {"title": "Andor", "platform": Platform.DISNEY_PLUS, "category": Category.SCIFI, "actors": ["Diego Luna", "Genevieve O'Reilly"], "director": "Tony Gilroy", "year": 2022, "description": "The rebellion begins in this prequel to Rogue One.", "similar_to": ["Rogue One", "The Mandalorian"]},
    {"title": "Reacher", "platform": Platform.PRIME, "category": Category.ACTION, "actors": ["Alan Ritchson", "Malcolm Goodwin"], "director": "Nick Santora", "year": 2022, "description": "A veteran military police investigator uncovers a conspiracy.", "similar_to": ["Jack Reacher", "Bosch"]},
    {"title": "Severance", "platform": Platform.APPLE_TV, "category": Category.SCIFI, "actors": ["Adam Scott", "Zach Cherry", "Britt Lower"], "director": "Dan Erickson", "year": 2022, "description": "Employees undergo a procedure to separate work and personal memories.", "similar_to": ["Westworld", "Black Mirror"]},
    {"title": "The Last of Us", "platform": Platform.HBO_MAX, "category": Category.DRAMA, "actors": ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna"], "director": "Craig Mazin", "year": 2023, "description": "A smuggler and a teenager survive in a post-apocalyptic world.", "similar_to": ["The Walking Dead", "Fallout"]},
    {"title": "Beef", "platform": Platform.NETFLIX, "category": Category.COMEDY, "actors": ["Steven Yeun", "Ali Wong"], "director": "Lee Sung Jin", "year": 2023, "description": "A feud between two strangers escalates into dark comedy.", "similar_to": ["Fleabag", "Master of None"]},
    {"title": "The Whites", "platform": Platform.HBO_MAX, "category": Category.THRILLER, "actors": ["Oscar Isaac", " Carey Mulligan"], "director": "Benito Montaño", "year": 2024, "description": "A detective's obsession with solving his own murder.", "similar_to": ["True Detective", "Sharp Objects"]},
    {"title": "Fallout", "platform": Platform.PRIME, "category": Category.SCIFI, "actors": ["Ella Purnell", "Aaron Stafford", "Kyle MacLachlan"], "director": "Jonathan Nolan", "year": 2024, "description": "Survivors navigate a post-nuclear wasteland.", "similar_to": ["The Last of Us", "Westworld"]},
    {"title": "Shogun", "platform": Platform.HULU, "category": Category.DRAMA, "actors": ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"], "director": "Rachel Kondo", "year": 2024, "description": "A shipwrecked Englishman becomes a samurai in feudal Japan.", "similar_to": ["The Last Samurai", "Kingdom"]},
    {"title": "The Gentlemen", "platform": Platform.NETFLIX, "category": Category.ACTION, "actors": ["Theo James", "Michele Hicks", "Kaya Scodelario"], "director": "Guy Ritchie", "year": 2024, "description": "An aristocrat inherits his family estate and discovers it sits on a marijuana empire.", "similar_to": ["Guy Richie's films", "Snatch"]},
    {"title": "Ripley", "platform": Platform.NETFLIX, "category": Category.THRILLER, "actors": ["Andrew Scott", "Johnny Flynn", "Dakota Fanning"], "director": "Steven Zaillian", "year": 2024, "description": "A grifter in 1960s Italy manipulates his way into luxury.", "similar_to": ["Catch Me If You Can", "The Talented Mr. Ripley"]},
    {"title": "House of the Dragon", "platform": Platform.HBO_MAX, "category": Category.FANTASY, "actors": ["Matt Smith", "Emma D'Arcy", "Olivia Cooke"], "director": "Ryan Condal", "year": 2022, "description": "Civil war tears apart the Targaryen dynasty.", "similar_to": ["Game of Thrones", "The Witcher"]},
    {"title": "Slow Horses", "platform": Platform.APPLE_TV, "category": Category.THRILLER, "actors": ["Gary Oldman", "Jack Lowden", "Olivia Colman"], "director": "Adam Gerahty", "year": 2022, "description": "British intelligence agents stuck in a dead-end job.", "similar_to": ["The Night Manager", "Killing Eve"]},
    {"title": "The Great", "platform": Platform.HULU, "category": Category.COMEDY, "actors": ["Elle Fanning", "Nicholas Hoult"], "director": "Tony McNamara", "year": 2020, "description": "A satirical take on Catherine the Great's rise to power.", "similar_to": ["The Marvelous Mrs. Maisel", "Fleabag"]},
    {"title": "For All Mankind", "platform": Platform.APPLE_TV, "category": Category.SCIFI, "actors": ["Joel Kinnaman", "Michael Dorman", "Sarah Jones"], "director": "Ronald D. Moore", "year": 2019, "description": "NASA races the Soviets in an alternate space history.", "similar_to": ["The First", "From the Earth to the Moon"]},
    {"title": " Disclaimer", "platform": Platform.APPLE_TV, "category": Category.THRILLER, "actors": ["Cate Blanchett", "Kevin Kline", "Sasha Wilder"], "director": "Alfonso Cuarón", "year": 2024, "description": "A journalist's career is destroyed by a mysterious video.", "similar_to": ["The Night Of", "Gone Girl"]},
    {"title": "Black Mirror", "platform": Platform.NETFLIX, "category": Category.SCIFI, "actors": ["Charlie Brooker (creator)"], "director": "Charlie Brooker", "year": 2011, "description": "Anthology series exploring the dark side of technology.", "similar_to": ["Electric Dreams", "Twilight Zone"]},
]


def calculate_category_preferences(history: List[ViewingHistory]) -> Dict[Category, float]:
    """Calculate category preferences based on watch time."""
    category_weights = {}

    for entry in history:
        weight = entry.watch_duration_minutes / 60.0  # hours
        if entry.category in category_weights:
            category_weights[entry.category] += weight
        else:
            category_weights[entry.category] = weight

    # Normalize to percentages
    total = sum(category_weights.values())
    if total == 0:
        return {}

    return {cat: (mins / total) * 100 for cat, mins in category_weights.items()}


def calculate_actor_preferences(history: List[ViewingHistory]) -> Dict[str, float]:
    """Calculate actor preferences based on appearances and watch time."""
    actor_weights = {}

    for entry in history:
        weight = entry.watch_duration_minutes / 60.0
        for actor in entry.actors:
            if actor in actor_weights:
                actor_weights[actor] += weight
            else:
                actor_weights[actor] = weight

    return actor_weights


def get_similarity_score(item: Dict, category_prefs: Dict, actor_prefs: Dict) -> Tuple[float, str]:
    """Calculate how well an item matches user preferences."""
    score = 0.0
    reasons = []

    # Category match
    category = Category(item["category"])
    if category in category_prefs:
        cat_score = category_prefs[category]
        score += cat_score * 0.5
        if cat_score > 20:
            reasons.append(f"You love {category.value} content")

    # Actor match
    for actor in item["actors"]:
        if actor in actor_prefs:
            actor_score = min(actor_prefs[actor] * 5, 30)  # Cap actor contribution
            score += actor_score
            if actor_score > 10:
                reasons.append(f"{actor} is one of your favorites")

    # Platform novelty (slight boost for variety)
    platform_bonus = 5
    score += platform_bonus

    # Normalize score to 0-100
    max_possible = 100
    final_score = min(score, max_possible)

    reason = reasons[0] if reasons else f"Popular on {item['platform'].value.replace('_', ' ').title()}"

    return final_score, reason


def generate_recommendations(
    history: List[ViewingHistory],
    user_platforms: List[Platform],
    limit: int = 10
) -> List[Recommendation]:
    """Generate personalized recommendations based on viewing history."""

    if not history:
        # Default recommendations for new users
        default_items = random.sample(CONTENT_CATALOG, min(limit, len(CONTENT_CATALOG)))
        return [
            Recommendation(
                title=item["title"],
                platform=item["platform"],
                match_score=random.uniform(70, 95),
                reason=f"Because you might enjoy {item['category'].value}",
                category=item["category"],
                actors=item["actors"],
                director=item["director"],
                year=item["year"],
                description=item["description"]
            )
            for item in default_items
        ]

    category_prefs = calculate_category_preferences(history)
    actor_prefs = calculate_actor_preferences(history)

    # Score all catalog items
    scored_items = []
    for item in CONTENT_CATALOG:
        score, reason = get_similarity_score(item, category_prefs, actor_prefs)
        scored_items.append((item, score, reason))

    # Sort by score descending
    scored_items.sort(key=lambda x: x[1], reverse=True)

    # Take top recommendations, optionally filtered by user platforms
    recommendations = []
    for item, score, reason in scored_items:
        if len(recommendations) >= limit:
            break

        # Add some variety - include items from different platforms
        rec = Recommendation(
            title=item["title"],
            platform=item["platform"],
            match_score=round(score, 1),
            reason=reason,
            category=item["category"],
            actors=item["actors"],
            director=item["director"],
            year=item["year"],
            description=item["description"]
        )
        recommendations.append(rec)

    return recommendations
