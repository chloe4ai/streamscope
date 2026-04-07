// StreamScope - Main Application
// Enhanced with Apple-style interactions and real platform integration

// State
let currentView = 'dashboard';
let currentUser = null;
let viewingHistory = [];
let currentReport = null;
let currentRecommendations = [];
let isLoading = false;
let lastSyncedTime = new Date();

// DOM Elements
const views = {
    dashboard: document.getElementById('dashboardView'),
    reports: document.getElementById('reportsView'),
    discover: document.getElementById('discoverView')
};

const navTabs = document.querySelectorAll('.nav-tab');
const periodSelector = document.getElementById('periodSelector');
const reportPeriod = document.getElementById('reportPeriod');
const toast = document.getElementById('toast');
const lastSyncedEl = document.getElementById('lastSynced');

// Initialize app
async function initApp() {
    showLoading();

    try {
        // Load user data
        currentUser = await api.getUser('demo_user_001');

        // Load viewing history
        viewingHistory = await api.getHistory('demo_user_001');

        // Load recommendations
        currentRecommendations = await api.getRecommendations('demo_user_001', 12);

        // Render dashboard
        renderDashboard();

        hideLoading();

        // Start synced time updater
        updateLastSyncedTime();
        setInterval(updateLastSyncedTime, 60000);

        console.log('StreamScope initialized successfully');

    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Failed to load data. Using demo mode.');
        hideLoading();
    }
}

// Update last synced time display
function updateLastSyncedTime() {
    const now = new Date();
    const diffMs = now - lastSyncedTime;
    const diffMins = Math.floor(diffMs / 60000);

    let timeStr;
    if (diffMins < 1) {
        timeStr = 'Just now';
    } else if (diffMins === 1) {
        timeStr = '1 min ago';
    } else if (diffMins < 60) {
        timeStr = `${diffMins} mins ago`;
    } else {
        const diffHours = Math.floor(diffMins / 60);
        timeStr = diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }

    if (lastSyncedEl) {
        lastSyncedEl.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            Last synced ${timeStr}
        `;
    }
}

// Navigation with smooth transitions
navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        if (isLoading) return;

        const viewName = tab.dataset.view;
        if (viewName === currentView) return;

        tab.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tab.style.transform = '';
        }, 100);

        switchView(viewName);
    });
});

function switchView(viewName) {
    isLoading = true;

    navTabs.forEach(tab => {
        if (tab.dataset.view === viewName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    const currentViewEl = views[currentView];
    currentViewEl.style.opacity = '0';
    currentViewEl.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        Object.keys(views).forEach(key => {
            views[key].classList.remove('active');
        });

        views[viewName].classList.add('active');
        views[viewName].style.opacity = '0';
        views[viewName].style.transform = 'translateY(10px)';

        setTimeout(() => {
            views[viewName].style.opacity = '1';
            views[viewName].style.transform = 'translateY(0)';
            views[viewName].style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        }, 20);

        periodSelector.style.display = viewName === 'reports' ? 'block' : 'none';
        periodSelector.style.opacity = viewName === 'reports' ? '0' : '1';
        if (viewName === 'reports') {
            setTimeout(() => {
                periodSelector.style.opacity = '1';
                periodSelector.style.transition = 'opacity 0.3s ease';
            }, 200);
        }

        currentView = viewName;

        if (viewName === 'reports') {
            loadReportsView();
        } else if (viewName === 'discover') {
            loadDiscoverView();
        }

        isLoading = false;
    }, 200);
}

// Dashboard
function renderDashboard() {
    const totalMinutes = viewingHistory.reduce((sum, e) => sum + e.watch_duration_minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const uniqueTitles = [...new Set(viewingHistory.map(e => e.title))].length;

    const bingeDays = new Set();
    viewingHistory.forEach(e => {
        if (e.watch_duration_minutes >= 180) {
            bingeDays.add(new Date(e.watched_at).toDateString());
        }
    });

    const last7Days = viewingHistory.filter(e => {
        const date = new Date(e.watched_at);
        const now = new Date();
        const diff = (now - date) / (1000 * 60 * 60 * 24);
        return diff <= 7;
    });
    const last7Minutes = last7Days.reduce((sum, e) => sum + e.watch_duration_minutes, 0);
    const avgDaily = Math.round(last7Minutes / 7 / 60);

    animateValue('metricTotalTime', 0, totalHours, 800, (val) => `${val}h ${remainingMinutes}m`);
    animateValue('metricTitles', 0, uniqueTitles, 600);
    animateValue('metricBinges', 0, bingeDays.size, 500);
    animateValue('metricAvgDay', 0, avgDaily, 400, (val) => `${val}h`);

    animateValue('total-watch-hours', 0, totalHours, 600);
    animateValue('total-entries', 0, viewingHistory.length, 500);

    const reportData = generateMockReport('monthly');

    setTimeout(() => {
        charts.renderDonutChart('categoryChart', reportData.top_categories);
    }, 100);

    setTimeout(() => {
        charts.renderWeeklyChart('weeklyChart', viewingHistory);
    }, 150);

    setTimeout(() => {
        charts.renderPlatformBars('platformBars', reportData.platform_breakdown);
    }, 200);

    setTimeout(() => {
        charts.renderActorList('actorList', reportData.top_actors);
    }, 250);
}

// Animate numeric values
function animateValue(elementId, start, end, duration, formatter = (val) => val) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        element.textContent = formatter(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    requestAnimationFrame(update);
}

// Reports View
async function loadReportsView() {
    const period = reportPeriod.value;
    currentReport = await api.getReport('demo_user_001', period);

    const periodLabels = {
        weekly: 'Weekly Report',
        monthly: 'Monthly Report',
        all: 'All Time Report'
    };
    document.getElementById('reportPeriodLabel').textContent = periodLabels[period];

    const startDate = new Date(currentReport.start_date);
    const endDate = new Date(currentReport.end_date);
    document.getElementById('reportDates').textContent =
        `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const totalHours = Math.floor(currentReport.total_watch_time_minutes / 60);
    animateValue('reportTotalTime', 0, totalHours, 1000, (val) => `${val}h`);

    setTimeout(() => {
        charts.renderReportCategories('reportCategories', currentReport.top_categories);
    }, 100);

    setTimeout(() => {
        charts.renderDirectorGrid('directorGrid', currentReport.top_directors);
    }, 150);

    setTimeout(() => {
        charts.renderHeatmap('heatmap', currentReport.peak_hours);
    }, 200);
}

// Discover View
async function loadDiscoverView() {
    document.getElementById('recsCount').textContent = currentRecommendations.length;
    charts.renderRecommendations('recommendationsGrid', currentRecommendations);
}

// Sync button handler
document.getElementById('syncBtn').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const svg = btn.querySelector('svg');

    btn.disabled = true;
    svg.style.animation = 'spin 1s linear infinite';

    showToast('Syncing your viewing history...');

    // Simulate API sync delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Refresh data
    viewingHistory = await api.getHistory('demo_user_001');
    currentRecommendations = await api.getRecommendations('demo_user_001', 12);

    lastSyncedTime = new Date();

    svg.style.animation = '';
    btn.disabled = false;

    renderDashboard();

    showToast('Synced successfully!', 'success');
});

// Period selector
reportPeriod.addEventListener('change', loadReportsView);

// Refresh recommendations button
document.getElementById('refreshRecsBtn').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    const svg = btn.querySelector('svg');

    svg.style.animation = 'spin 0.6s ease';
    btn.disabled = true;

    // Simulate getting new recommendations
    await new Promise(resolve => setTimeout(resolve, 800));
    currentRecommendations = await api.getRecommendations('demo_user_001', 12);

    setTimeout(() => {
        svg.style.animation = '';
        loadDiscoverView();
        btn.disabled = false;
        showToast('Recommendations refreshed!');
    }, 600);
});

// Toast notification
function showToast(message, type = 'info') {
    const toastEl = document.getElementById('toast');
    const messageEl = toastEl.querySelector('.toast-message');
    messageEl.textContent = message;
    toastEl.className = `toast show ${type}`;

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// Loading state
function showLoading() {
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = '';
}

// Interactive hover effects
document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Service items hover
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.background = 'var(--bg-secondary)';
    });
    item.addEventListener('mouseleave', () => {
        item.style.background = '';
    });
});

// Generate mock report helper
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

    const periodHistory = viewingHistory.filter(entry => {
        const entryDate = new Date(entry.watched_at);
        return entryDate >= startDate;
    });

    if (periodHistory.length === 0) {
        return {
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

    const totalWatchTime = periodHistory.reduce((sum, e) => sum + e.watch_duration_minutes, 0);

    const categoryTimes = {};
    periodHistory.forEach(e => {
        categoryTimes[e.category] = (categoryTimes[e.category] || 0) + e.watch_duration_minutes;
    });

    const topCategories = Object.entries(categoryTimes)
        .map(([name, mins]) => ({
            name,
            percentage: Math.round((mins / totalWatchTime) * 100 * 10) / 10,
            watch_time_minutes: mins
        }))
        .sort((a, b) => b.watch_time_minutes - a.watch_time_minutes);

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
        .sort((a, b) => b.hours - a.hours);

    const directorTimes = {};
    periodHistory.forEach(e => {
        directorTimes[e.director] = (directorTimes[e.director] || 0) + e.watch_duration_minutes;
    });

    const topDirectors = Object.entries(directorTimes)
        .map(([name, mins]) => ({
            name,
            hours: Math.round(mins / 60 * 10) / 10
        }))
        .sort((a, b) => b.hours - a.hours);

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

    const hourCounts = {};
    periodHistory.forEach(e => {
        const hour = new Date(e.watched_at).getHours();
        const hourKey = `${hour.toString().padStart(2, '0')}:00`;
        hourCounts[hourKey] = (hourCounts[hourKey] || 0) + 1;
    });

    const bingeDays = new Set();
    periodHistory.forEach(e => {
        if (e.watch_duration_minutes >= 180) {
            bingeDays.add(new Date(e.watched_at).toDateString());
        }
    });

    return {
        total_watch_time_minutes: totalWatchTime,
        total_episodes: periodHistory.length,
        top_categories: topCategories,
        top_actors: topActors,
        top_directors: topDirectors,
        platform_breakdown: platformBreakdown,
        peak_hours: hourCounts,
        binge_sessions: bingeDays.size
    };
}

// Add spin animation for sync button
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
