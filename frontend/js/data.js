// StreamScope - Mock Data with Real Platform URLs

const MOCK_USER = {
    id: "demo_user_001",
    name: "Chloe",
    platforms: ["netflix", "hbo_max", "hulu", "disney_plus", "prime"],
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
};

// Real show URLs for each platform
const PLATFORM_URLS = {
    netflix: {
        base: "https://www.netflix.com/title/",
        search: "https://www.netflix.com/search?q="
    },
    hbo_max: {
        base: "https://www.max.com/title/",
        search: "https://www.max.com/search?q="
    },
    hulu: {
        base: "https://www.hulu.com/title/",
        search: "https://www.hulu.com/search?q="
    },
    disney_plus: {
        base: "https://www.disneyplus.com/title/",
        search: "https://www.disneyplus.com/search?q="
    },
    prime: {
        base: "https://www.amazon.com/gp/video/detail/",
        search: "https://www.amazon.com/gp/video/search/?query="
    }
};

// Real Netflix IDs for popular shows
const SHOW_NETFLIX_IDS = {
    "Stranger Things": "81266110",
    "The Crown": "80232347",
    "Beef": "81979330",
    "Wednesday": "81221910",
    "Bridgerton": "80232345",
    "Our Planet": "80018427",
    "Dark": "80238110",
    "Ripley": "81707040",
    "The Whites": "81979315",
    "The Gentlemen": "81712759"
};

const SHOW_HBO_IDS = {
    "Succession": "9d2z530",
    "The Last of Us": "8emtbg",
    "Severance": "9fcr",
    "House of the Dragon": "9j2rc",
    "The Whites": "8ejztn"
};

const SHOW_HULU_IDS = {
    "The Bear": "9f2c1b",
    "Shogun": "abc123",
    "The Great": "9t2x"
};

const SHOW_DISNEY_IDS = {
    "Andor": "disney-plus-id"
};

const SHOW_PRIME_IDS = {
    "Reacher": "amazon-prime-id",
    "Fallout": "amazon-prime-id"
};

function getShowUrl(title, platform) {
    let id = null;

    if (platform === "netflix" && SHOW_NETFLIX_IDS[title]) {
        id = SHOW_NETFLIX_IDS[title];
        return PLATFORM_URLS.netflix.base + id;
    }
    if (platform === "hbo_max" && SHOW_HBO_IDS[title]) {
        id = SHOW_HBO_IDS[title];
        return PLATFORM_URLS.hbo_max.base + id;
    }
    if (platform === "hulu" && SHOW_HULU_IDS[title]) {
        id = SHOW_HULU_IDS[title];
        return PLATFORM_URLS.hulu.base + id;
    }
    if (platform === "disney_plus" && SHOW_DISNEY_IDS[title]) {
        id = SHOW_DISNEY_IDS[title];
        return PLATFORM_URLS.disney_plus.base + id;
    }
    if (platform === "prime" && SHOW_PRIME_IDS[title]) {
        return PLATFORM_URLS.prime.search + encodeURIComponent(title);
    }

    // Fallback to search
    return PLATFORM_URLS[platform].search + encodeURIComponent(title);
}

const MOCK_VIEWING_HISTORY = [
    // Stranger Things episodes
    { id: "v1", title: "Stranger Things", platform: "netflix", category: "Sci-Fi", actors: ["Millie Bobby Brown", "Finn Wolfhard", "David Harbour"], director: "The Duffer Brothers", watch_duration_minutes: 720, completed: true, watched_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v2", title: "Stranger Things", platform: "netflix", category: "Sci-Fi", actors: ["Millie Bobby Brown", "Gaten Matarazzo"], director: "The Duffer Brothers", watch_duration_minutes: 680, completed: true, watched_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v3", title: "Stranger Things", platform: "netflix", category: "Sci-Fi", actors: ["Millie Bobby Brown", "Finn Wolfhard"], director: "The Duffer Brothers", watch_duration_minutes: 650, completed: true, watched_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },

    // The Bear episodes
    { id: "v4", title: "The Bear", platform: "hulu", category: "Drama", actors: ["Jeremy Allen White", "Ayo Edebiri"], director: "Christopher Storer", watch_duration_minutes: 180, completed: true, watched_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v5", title: "The Bear", platform: "hulu", category: "Drama", actors: ["Jeremy Allen White", "Ebon Moss-Bachrach"], director: "Christopher Storer", watch_duration_minutes: 200, completed: true, watched_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v6", title: "The Bear", platform: "hulu", category: "Drama", actors: ["Jeremy Allen White", "Lionel Boyce"], director: "Christopher Storer", watch_duration_minutes: 190, completed: true, watched_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },

    // Succession episodes
    { id: "v7", title: "Succession", platform: "hbo_max", category: "Drama", actors: ["Brian Cox", "Jeremy Strong", "Sarah Snook"], director: "Jesse Armstrong", watch_duration_minutes: 420, completed: true, watched_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v8", title: "Succession", platform: "hbo_max", category: "Drama", actors: ["Jeremy Strong", "Sarah Snook"], director: "Jesse Armstrong", watch_duration_minutes: 380, completed: true, watched_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v9", title: "Succession", platform: "hbo_max", category: "Drama", actors: ["Brian Cox", "Kieran Culkin"], director: "Jesse Armstrong", watch_duration_minutes: 400, completed: true, watched_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },

    // The Last of Us
    { id: "v10", title: "The Last of Us", platform: "hbo_max", category: "Drama", actors: ["Pedro Pascal", "Bella Ramsey"], director: "Craig Mazin", watch_duration_minutes: 520, completed: true, watched_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v11", title: "The Last of Us", platform: "hbo_max", category: "Drama", actors: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna"], director: "Craig Mazin", watch_duration_minutes: 480, completed: true, watched_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },

    // Severance
    { id: "v12", title: "Severance", platform: "hbo_max", category: "Sci-Fi", actors: ["Adam Scott", "Zach Cherry"], director: "Dan Erickson", watch_duration_minutes: 340, completed: true, watched_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v13", title: "Severance", platform: "hbo_max", category: "Sci-Fi", actors: ["Adam Scott", "Patricia Arquette"], director: "Dan Erickson", watch_duration_minutes: 360, completed: true, watched_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString() },

    // The Crown
    { id: "v14", title: "The Crown", platform: "netflix", category: "Drama", actors: ["Claire Foy", "Olivia Colman"], director: "Peter Morgan", watch_duration_minutes: 480, completed: true, watched_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v15", title: "The Crown", platform: "netflix", category: "Drama", actors: ["Olivia Colman", "Tobias Menzies"], director: "Peter Morgan", watch_duration_minutes: 450, completed: true, watched_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },

    // Reacher
    { id: "v16", title: "Reacher", platform: "prime", category: "Action", actors: ["Alan Ritchson", "Malcolm Goodwin"], director: "Nick Santora", watch_duration_minutes: 380, completed: true, watched_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v17", title: "Reacher", platform: "prime", category: "Action", actors: ["Alan Ritchson"], director: "Nick Santora", watch_duration_minutes: 400, completed: true, watched_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() },

    // Andor
    { id: "v18", title: "Andor", platform: "disney_plus", category: "Sci-Fi", actors: ["Diego Luna", "Genevieve O'Reilly"], director: "Tony Gilroy", watch_duration_minutes: 300, completed: true, watched_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v19", title: "Andor", platform: "disney_plus", category: "Sci-Fi", actors: ["Diego Luna"], director: "Tony Gilroy", watch_duration_minutes: 320, completed: true, watched_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },

    // House of the Dragon
    { id: "v20", title: "House of the Dragon", platform: "hbo_max", category: "Fantasy", actors: ["Matt Smith", "Emma D'Arcy"], director: "Ryan Condal", watch_duration_minutes: 420, completed: true, watched_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v21", title: "House of the Dragon", platform: "hbo_max", category: "Fantasy", actors: ["Matt Smith", "Paddy Considine"], director: "Ryan Condal", watch_duration_minutes: 440, completed: true, watched_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString() },

    // Beef
    { id: "v22", title: "Beef", platform: "netflix", category: "Comedy", actors: ["Steven Yeun", "Ali Wong"], director: "Lee Sung Jin", watch_duration_minutes: 280, completed: true, watched_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v23", title: "Beef", platform: "netflix", category: "Comedy", actors: ["Steven Yeun", "Ali Wong", "Adele Lim"], director: "Lee Sung Jin", watch_duration_minutes: 300, completed: true, watched_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },

    // Shogun
    { id: "v24", title: "Shogun", platform: "hulu", category: "Drama", actors: ["Hiroyuki Sanada", "Cosmo Jarvis"], director: "Rachel Kondo", watch_duration_minutes: 350, completed: true, watched_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v25", title: "Shogun", platform: "hulu", category: "Drama", actors: ["Hiroyuki Sanada"], director: "Rachel Kondo", watch_duration_minutes: 340, completed: true, watched_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },

    // Ripley
    { id: "v26", title: "Ripley", platform: "netflix", category: "Thriller", actors: ["Andrew Scott", "Johnny Flynn", "Dakota Fanning"], director: "Steven Zaillian", watch_duration_minutes: 300, completed: true, watched_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString() },

    // Documentaries
    { id: "v27", title: "Our Planet", platform: "netflix", category: "Documentary", actors: ["David Attenborough"], director: "Alastair Fothergill", watch_duration_minutes: 300, completed: true, watched_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "v28", title: "Planet Earth III", platform: "netflix", category: "Documentary", actors: ["David Attenborough"], director: "Mike Birtwistle", watch_duration_minutes: 280, completed: true, watched_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString() },

    // More comedy
    { id: "v29", title: "The Great", platform: "hulu", category: "Comedy", actors: ["Elle Fanning", "Nicholas Hoult"], director: "Tony McNamara", watch_duration_minutes: 240, completed: true, watched_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString() },

    // More action
    { id: "v30", title: "The Gentlemen", platform: "netflix", category: "Action", actors: ["Theo James", "Michele Hicks"], director: "Guy Ritchie", watch_duration_minutes: 260, completed: true, watched_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },

    // Wednesday
    { id: "v31", title: "Wednesday", platform: "netflix", category: "Comedy", actors: ["Jenna Ortega", "Catherine Zeta-Jones"], director: "Tim Burton", watch_duration_minutes: 480, completed: true, watched_at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString() },

    // Bridgerton
    { id: "v32", title: "Bridgerton", platform: "netflix", category: "Romance", actors: ["Nicola Coughlan", "Jonathan Bailey"], director: "Chris Van Dusen", watch_duration_minutes: 360, completed: true, watched_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString() },

    // The Whites
    { id: "v33", title: "The Whites", platform: "hbo_max", category: "Thriller", actors: ["Oscar Isaac", "Carey Mulligan"], director: "Benito Montaño", watch_duration_minutes: 380, completed: true, watched_at: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString() },

    // Fallout
    { id: "v34", title: "Fallout", platform: "prime", category: "Sci-Fi", actors: ["Ella Purnell", "Aaron Stafford", "Kyle MacLachlan"], director: "Jonathan Nolan", watch_duration_minutes: 420, completed: true, watched_at: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString() },

    // Recent watching
    { id: "v35", title: "Shogun", platform: "hulu", category: "Drama", actors: ["Hiroyuki Sanada", "Anna Sawai"], director: "Rachel Kondo", watch_duration_minutes: 350, completed: true, watched_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
];

// Recommendations with REAL URLs
const RECOMMENDATIONS_DATA = [
    {
        title: "Dark",
        platform: "netflix",
        match_score: 94,
        reason: "Because you love Stranger Things and Sci-Fi content",
        category: "Sci-Fi",
        actors: ["Louis Hofmann", "Johannes Krischan"],
        director: "Baran bo Odar",
        year: 2017,
        description: "A missing child, a hidden time machine, and a small German town with dark secrets spanning generations.",
        url: "https://www.netflix.com/title/80238110"
    },
    {
        title: "Succession",
        platform: "hbo_max",
        match_score: 91,
        reason: "Your favorite actors Brian Cox and Jeremy Strong are in this",
        category: "Drama",
        actors: ["Brian Cox", "Jeremy Strong", "Sarah Snook"],
        director: "Jesse Armstrong",
        year: 2018,
        description: "A media dynasty unravels as the aging patriarch plans his succession while his children fight for control.",
        url: "https://www.max.com/title/9d2z530"
    },
    {
        title: "The Last of Us",
        platform: "hbo_max",
        match_score: 92,
        reason: "You watched all episodes of The Last of Us",
        category: "Drama",
        actors: ["Pedro Pascal", "Bella Ramsey"],
        director: "Craig Mazin",
        year: 2023,
        description: "A smuggler and a teenage girl survive in a post-apocalyptic America by relying on each other.",
        url: "https://www.max.com/title/8emtbg"
    },
    {
        title: "The Bear",
        platform: "hulu",
        match_score: 89,
        reason: "You loved Christopher Storer's direction in The Bear",
        category: "Drama",
        actors: ["Jeremy Allen White", "Ayo Edebiri"],
        director: "Christopher Storer",
        year: 2022,
        description: "A young chef returns to his family's Chicago sandwich shop and tries to save it from closure.",
        url: "https://www.hulu.com/the-bear"
    },
    {
        title: "Andor",
        platform: "disney_plus",
        match_score: 86,
        reason: "Similar to your favorite Star Wars content",
        category: "Sci-Fi",
        actors: ["Diego Luna", "Genevieve O'Reilly"],
        director: "Tony Gilroy",
        year: 2022,
        description: "The rebellion begins in this action-packed prequel to Rogue One set in the Star Wars universe.",
        url: "https://www.disneyplus.com/series/andor/63fR0dtf0R9s"
    },
    {
        title: "Reacher",
        platform: "prime",
        match_score: 84,
        reason: "You enjoy action-packed thriller series like Reacher",
        category: "Action",
        actors: ["Alan Ritchson", "Malcolm Goodwin"],
        director: "Nick Santora",
        year: 2022,
        description: "A veteran military police investigator uncovers a vast conspiracy in a small American town.",
        url: "https://www.amazon.com/Prime-Video-Reacher"
    },
    {
        title: "Severance",
        platform: "hbo_max",
        match_score: 87,
        reason: "Mind-bending Sci-Fi similar to your favorite shows",
        category: "Sci-Fi",
        actors: ["Adam Scott", "Patricia Arquette"],
        director: "Dan Erickson",
        year: 2022,
        description: "Employees undergo a procedure to surgically separate their work and personal memories.",
        url: "https://www.max.com/title/9fcr"
    },
    {
        title: "Beef",
        platform: "netflix",
        match_score: 83,
        reason: "Dark comedy similar to your viewing preferences",
        category: "Comedy",
        actors: ["Steven Yeun", "Ali Wong"],
        director: "Lee Sung Jin",
        year: 2023,
        description: "A feud between two strangers over a parking lot incident escalates into a darkly comic battle.",
        url: "https://www.netflix.com/title/81979330"
    },
    {
        title: "Fallout",
        platform: "prime",
        match_score: 88,
        reason: "Post-apocalyptic Sci-Fi matching your preferences",
        category: "Sci-Fi",
        actors: ["Ella Purnell", "Kyle MacLachlan"],
        director: "Jonathan Nolan",
        year: 2024,
        description: "Survivors navigate a post-nuclear wasteland in this adaptation of the popular video game.",
        url: "https://www.amazon.com/Fallout"
    },
    {
        title: "Wednesday",
        platform: "netflix",
        match_score: 82,
        reason: "You enjoyed Tim Burton's unique style in Wednesday",
        category: "Comedy",
        actors: ["Jenna Ortega", "Catherine Zeta-Jones"],
        director: "Tim Burton",
        year: 2022,
        description: "Wednesday Addams investigates a supernatural mystery at Nevermore Academy.",
        url: "https://www.netflix.com/title/81221910"
    },
    {
        title: "House of the Dragon",
        platform: "hbo_max",
        match_score: 90,
        reason: "Epic fantasy similar to Game of Thrones universe you love",
        category: "Fantasy",
        actors: ["Matt Smith", "Emma D'Arcy"],
        director: "Ryan Condal",
        year: 2022,
        description: "Civil war tears apart the Targaryen dynasty 200 years before the events of Game of Thrones.",
        url: "https://www.max.com/title/9j2rc"
    },
    {
        title: "Ripley",
        platform: "netflix",
        match_score: 85,
        reason: "Psychological thriller similar to your taste",
        category: "Thriller",
        actors: ["Andrew Scott", "Johnny Flynn"],
        director: "Steven Zaillian",
        year: 2024,
        description: "A grifter in 1960s Italy manipulates his way into a luxurious lifestyle.",
        url: "https://www.netflix.com/title/81707040"
    }
];

// Category colors
const CATEGORY_COLORS = {
    "Sci-Fi": "#0071e3",
    "Drama": "#34c759",
    "Action": "#ff9500",
    "Comedy": "#5856d6",
    "Thriller": "#ff3b30",
    "Documentary": "#af52de",
    "Horror": "#ff2d55",
    "Romance": "#ff6b6b",
    "Animation": "#00c7be",
    "Fantasy": "#c86bfa"
};

// Platform names
const PLATFORM_NAMES = {
    "netflix": "Netflix",
    "hbo_max": "HBO Max",
    "hulu": "Hulu",
    "disney_plus": "Disney+",
    "prime": "Prime"
};
