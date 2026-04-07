// StreamScope - API Module
// Handles communication with backend, falls back to mock data in demo mode

const API_BASE = 'http://localhost:8000/api';
let useMockData = true; // Demo mode

// API Client
const api = {
    // Get user profile
    async getUser(userId) {
        if (useMockData) {
            return MOCK_USER;
        }
        try {
            const response = await fetch(`${API_BASE}/user/${userId}`);
            if (!response.ok) throw new Error('User not found');
            return await response.json();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            useMockData = true;
            return MOCK_USER;
        }
    },

    // Get viewing history
    async getHistory(userId, limit = null) {
        if (useMockData) {
            return limit ? MOCK_VIEWING_HISTORY.slice(0, limit) : MOCK_VIEWING_HISTORY;
        }
        try {
            const url = limit
                ? `${API_BASE}/user/${userId}/history?limit=${limit}`
                : `${API_BASE}/user/${userId}/history`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            useMockData = true;
            return limit ? MOCK_VIEWING_HISTORY.slice(0, limit) : MOCK_VIEWING_HISTORY;
        }
    },

    // Add viewing entry
    async addEntry(userId, entry) {
        if (useMockData) {
            const newEntry = {
                id: 'v' + Date.now(),
                ...entry,
                watched_at: new Date().toISOString()
            };
            MOCK_VIEWING_HISTORY.unshift(newEntry);
            return newEntry;
        }
        try {
            const response = await fetch(`${API_BASE}/user/${userId}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            return await response.json();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            const newEntry = {
                id: 'v' + Date.now(),
                ...entry,
                watched_at: new Date().toISOString()
            };
            MOCK_VIEWING_HISTORY.unshift(newEntry);
            return newEntry;
        }
    },

    // Get report
    async getReport(userId, period = 'monthly') {
        if (useMockData) {
            return generateMockReport(period);
        }
        try {
            const response = await fetch(`${API_BASE}/user/${userId}/reports?period=${period}`);
            if (!response.ok) throw new Error('Report generation failed');
            return await response.json();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            return generateMockReport(period);
        }
    },

    // Get recommendations
    async getRecommendations(userId, limit = 10) {
        if (useMockData) {
            return RECOMMENDATIONS_DATA.slice(0, limit);
        }
        try {
            const response = await fetch(`${API_BASE}/user/${userId}/recommendations?limit=${limit}`);
            return await response.json();
        } catch (error) {
            console.warn('API unavailable, using mock data');
            return RECOMMENDATIONS_DATA.slice(0, limit);
        }
    }
};

// Generate mock report data
function generateMockReport(period) {
    const now = new Date();
    let startDate;

    if (period === 'weekly') {
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'monthly') {
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
    } else {
        startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
    }

    // Filter history by period
    const periodHistory = MOCK_VIEWING_HISTORY.filter(entry => {
        const entryDate = new Date(entry.watched_at);
        return entryDate >= startDate;
    });

    if (periodHistory.length === 0) {
        return generateEmptyReport(userId, period, startDate, now);
    }

    // Calculate metrics
    const totalWatchTime = periodHistory.reduce((sum, e) => sum + e.watch_duration_minutes, 0);
    const totalEpisodes = periodHistory.length;

    // Category breakdown
    const categoryTimes = {};
    periodHistory.forEach(e => {
        categoryTimes[e.category] = (categoryTimes[e.category] || 0) + e.watch_duration_minutes;
    });

    const categoryBreakdown = Object.entries(categoryTimes)
        .map(([name, mins]) => ({
            name,
            percentage: Math.round((mins / totalWatchTime) * 100 * 10) / 10,
            watch_time_minutes: mins
        }))
        .sort((a, b) => b.watch_time_minutes - a.watch_time_minutes);

    // Actor breakdown
    const actorTimes = {};
    periodHistory.forEach(e => {
        e.actors.forEach(actor => {
            actorTimes[actor] = (actorTimes[actor] || 0) + e.watch_duration_minutes;
        });
    });

    const topActors = Object.entries(actorTimes)
        .map(([name, mins]) => ({
            name,
            hours: Math.round(mins / 60 * 10) / 10,
            appearances: periodHistory.filter(e => e.actors.includes(name)).length
        }))
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 10);

    // Director breakdown
    const directorTimes = {};
    periodHistory.forEach(e => {
        directorTimes[e.director] = (directorTimes[e.director] || 0) + e.watch_duration_minutes;
    });

    const topDirectors = Object.entries(directorTimes)
        .map(([name, mins]) => ({
            name,
            hours: Math.round(mins / 60 * 10) / 10
        }))
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 5);

    // Platform breakdown
    const platformTimes = {};
    periodHistory.forEach(e => {
        platformTimes[e.platform] = (platformTimes[e.platform] || 0) + e.watch_duration_minutes;
    });

    const platformBreakdown = Object.entries(platformTimes)
        .map(([platform, mins]) => ({
            platform,
            percentage: Math.round((mins / totalWatchTime) * 100 * 10) / 10,
            watch_time_minutes: mins
        }))
        .sort((a, b) => b.watch_time_minutes - a.watch_time_minutes);

    // Peak hours
    const hourCounts = {};
    periodHistory.forEach(e => {
        const hour = new Date(e.watched_at).getHours();
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;
        hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });

    // Binge sessions
    const bingeDays = new Set();
    periodHistory.forEach(e => {
        if (e.watch_duration_minutes >= 180) {
            bingeDays.add(new Date(e.watched_at).toDateString());
        }
    });

    return {
        user_id: 'demo_user_001',
        period,
        start_date: startDate.toISOString(),
        end_date: now.toISOString(),
        total_watch_time_minutes: totalWatchTime,
        total_episodes: totalEpisodes,
        top_categories: categoryBreakdown,
        top_actors: topActors,
        top_directors: topDirectors,
        platform_breakdown: platformBreakdown,
        peak_hours: hourCounts,
        binge_sessions: bingeDays.size
    };
}

function generateEmptyReport(userId, period, startDate, endDate) {
    return {
        user_id: userId,
        period,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_watch_time_minutes: 0,
        total_episodes: 0,
        top_categories: [],
        top_actors: [],
        top_directors: [],
        platform_breakdown: [],
        peak_hours: {},
        binge_sessions: 0
    };
}
