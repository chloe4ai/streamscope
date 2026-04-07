// StreamScope - Charts Module
// Handles all chart visualizations with animations

const charts = {
    // Render donut chart for categories
    renderDonutChart(containerId, data) {
        const container = document.getElementById(containerId);
        const legendContainer = document.getElementById(containerId.replace('Chart', 'Legend'));

        if (!container || !data || data.length === 0) return;

        const total = data.reduce((sum, d) => sum + d.watch_time_minutes, 0);
        const size = 160;
        const strokeWidth = 28;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const center = size / 2;

        let currentOffset = 0;
        const segments = data.map((item, index) => {
            const percentage = item.watch_time_minutes / total;
            const dashLength = circumference * percentage;
            const dashOffset = circumference * currentOffset;
            currentOffset += percentage;

            return `
                <circle
                    cx="${center}"
                    cy="${center}"
                    r="${radius}"
                    fill="none"
                    stroke="${CATEGORY_COLORS[item.name] || '#6366f1'}"
                    stroke-width="${strokeWidth}"
                    stroke-dasharray="${dashLength} ${circumference - dashLength}"
                    stroke-dashoffset="${-dashOffset}"
                    stroke-linecap="round"
                    style="
                        transform: rotate(-90deg);
                        transform-origin: center;
                        opacity: 0;
                        animation: donutFadeIn 0.5s ease forwards;
                        animation-delay: ${index * 0.1}s;
                    "
                    class="donut-segment"
                    data-category="${item.name}"
                    data-value="${item.percentage}%"
                />
            `;
        }).join('');

        container.innerHTML = `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#f0f0f2" stroke-width="${strokeWidth}"/>
                ${segments}
            </svg>
        `;

        // Render legend
        if (legendContainer) {
            legendContainer.innerHTML = data.slice(0, 5).map((item, index) => `
                <div class="legend-item" style="opacity: 0; animation: fadeInUp 0.4s ease forwards; animation-delay: ${index * 0.08}s;">
                    <span class="legend-color" style="background: ${CATEGORY_COLORS[item.name] || '#6366f1'}"></span>
                    <span class="legend-label">${item.name}</span>
                    <span class="legend-value">${item.percentage}%</span>
                </div>
            `).join('');
        }
    },

    // Render weekly bar chart
    renderWeeklyChart(containerId, history) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const days = [];
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date,
                label: dayLabels[date.getDay()],
                minutes: 0
            });
        }

        // Aggregate watch time by day
        history.forEach(entry => {
            const entryDate = new Date(entry.watched_at);
            const dayIndex = days.findIndex(d =>
                d.date.toDateString() === entryDate.toDateString()
            );
            if (dayIndex !== -1) {
                days[dayIndex].minutes += entry.watch_duration_minutes;
            }
        });

        const maxMinutes = Math.max(...days.map(d => d.minutes), 60);

        container.innerHTML = days.map((day, index) => {
            const heightPercent = (day.minutes / maxMinutes) * 100;
            const hours = Math.round(day.minutes / 60 * 10) / 10;
            return `
                <div class="bar-item">
                    <div class="bar"
                         data-value="${hours}h"
                         style="
                            height: 0%;
                            animation: barGrow 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                            animation-delay: ${index * 0.08}s;
                         ">
                    </div>
                    <span class="bar-label">${day.label}</span>
                </div>
            `;
        }).join('');

        // Trigger animation after element is added
        setTimeout(() => {
            const bars = container.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                const targetHeight = ((days[index].minutes / maxMinutes) * 100) || 2;
                bar.style.height = `${Math.max(targetHeight, 2)}%`;
            });
        }, 50);
    },

    // Render platform bars
    renderPlatformBars(containerId, platformData) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const maxPercentage = Math.max(...platformData.map(p => p.percentage), 1);

        container.innerHTML = platformData.map((platform, index) => `
            <div class="platform-bar-item" style="opacity: 0; animation: fadeInUp 0.4s ease forwards; animation-delay: ${index * 0.1}s;">
                <span class="platform-bar-label">${PLATFORM_NAMES[platform.platform] || platform.platform}</span>
                <div class="platform-bar-track">
                    <div class="platform-bar-fill" data-width="${(platform.percentage / maxPercentage) * 100}%">
                        <span>${platform.percentage}%</span>
                    </div>
                </div>
            </div>
        `).join('');

        // Animate bars after render
        setTimeout(() => {
            const fills = container.querySelectorAll('.platform-bar-fill');
            fills.forEach(fill => {
                fill.style.width = fill.dataset.width + '%';
            });
        }, 100);
    },

    // Render actor list
    renderActorList(containerId, actors) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = actors.slice(0, 8).map((actor, index) => `
            <div class="actor-item" style="opacity: 0; animation: fadeInUp 0.3s ease forwards; animation-delay: ${index * 0.05}s;">
                <span class="actor-rank">${index + 1}</span>
                <span class="actor-name">${actor.name}</span>
                <span class="actor-hours">${actor.hours}h</span>
            </div>
        `).join('');
    },

    // Render report categories
    renderReportCategories(containerId, categories) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const maxPercentage = Math.max(...categories.map(c => c.percentage), 1);

        container.innerHTML = categories.map((cat, index) => `
            <div class="category-bar" style="opacity: 0; animation: fadeInUp 0.4s ease forwards; animation-delay: ${index * 0.08}s;">
                <span class="category-bar-label">${cat.name}</span>
                <div class="category-bar-track">
                    <div class="category-bar-fill" data-width="${(cat.percentage / maxPercentage) * 100}%">
                        <span>${cat.percentage}%</span>
                    </div>
                </div>
                <span class="category-bar-meta">${Math.round(cat.watch_time_minutes / 60)}h watched</span>
            </div>
        `).join('');

        // Animate after render
        setTimeout(() => {
            const fills = container.querySelectorAll('.category-bar-fill');
            fills.forEach(fill => {
                fill.style.width = fill.dataset.width + '%';
            });
        }, 100);
    },

    // Render director grid
    renderDirectorGrid(containerId, directors) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = directors.map((d, index) => `
            <div class="director-card" style="opacity: 0; animation: fadeInUp 0.3s ease forwards; animation-delay: ${index * 0.06}s;">
                <span class="director-name">${d.name}</span>
                <span class="director-hours">${d.hours} hours</span>
            </div>
        `).join('');
    },

    // Render heatmap
    renderHeatmap(containerId, peakHours) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Generate heatmap data based on peak hours
        const heatData = [];
        for (let h = 6; h <= 24; h += 3) {
            for (let d = 0; d < 7; d++) {
                const hourKey = `${h.toString().padStart(2, '0')}:00`;
                let count = peakHours[hourKey] || 0;
                // Add some variation for visual interest
                if (count === 0 && Math.random() > 0.5) {
                    count = Math.floor(Math.random() * 3);
                }
                heatData.push({ hour: h, day: d, count });
            }
        }

        const maxCount = Math.max(...heatData.map(h => h.count), 1);

        let html = '<div class="heatmap-label"></div>';
        days.forEach(day => {
            html += `<div class="heatmap-label">${day}</div>`;
        });

        heatData.forEach((h, i) => {
            const level = h.count === 0 ? 0 : Math.ceil((h.count / maxCount) * 4);
            if (i % 7 === 0) {
                const hourLabel = hours[Math.floor(i / 7)] || '';
                html += `<div class="heatmap-label">${hourLabel}</div>`;
            }
            html += `<div class="heatmap-cell level-${level}" style="animation-delay: ${i * 0.02}s;">${h.count || ''}</div>`;
        });

        container.innerHTML = html;
    },

    // Render recommendations with clickable URLs
    renderRecommendations(containerId, recommendations) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = recommendations.map((rec, index) => `
            <a href="${rec.url}" target="_blank" rel="noopener noreferrer" class="rec-card" style="opacity: 0; animation: fadeInUp 0.5s ease forwards; animation-delay: ${index * 0.1}s; text-decoration: none; color: inherit; display: block;">
                <div class="rec-card-header">
                    <div>
                        <div class="rec-title">${rec.title}
                            <svg class="external-link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </div>
                        <div class="rec-meta">
                            <span class="rec-badge ${rec.platform}">${PLATFORM_NAMES[rec.platform] || rec.platform}</span>
                            <span>${rec.category}</span>
                            <span>${rec.year}</span>
                        </div>
                    </div>
                    <div class="rec-score">
                        <span class="rec-score-value">${rec.match_score}%</span>
                        <span class="rec-score-label">Match</span>
                    </div>
                </div>
                <div class="rec-card-body">
                    <div class="rec-reason">${rec.reason}</div>
                    <p class="rec-description">${rec.description}</p>
                    <div class="rec-actors">
                        <strong>Cast:</strong> ${rec.actors.slice(0, 3).join(', ')}
                    </div>
                    <div class="rec-watch-cta">
                        <span class="watch-btn ${rec.platform}">
                            Watch on ${PLATFORM_NAMES[rec.platform] || rec.platform}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </a>
        `).join('');
    }
};

// Add CSS animations for charts
const chartAnimations = document.createElement('style');
chartAnimations.textContent = `
    @keyframes donutFadeIn {
        from { opacity: 0; transform: rotate(-90deg) scale(0.8); }
        to { opacity: 1; transform: rotate(-90deg) scale(1); }
    }

    @keyframes barGrow {
        from { height: 0 !important; }
    }

    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }

    .external-link-icon {
        opacity: 0;
        transition: opacity 0.2s;
        vertical-align: middle;
        margin-left: 4px;
    }

    .rec-card:hover .external-link-icon {
        opacity: 0.6;
    }

    .rec-watch-cta {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--border-light);
    }

    .watch-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: var(--radius-full);
        font-size: 0.8rem;
        font-weight: 600;
        transition: all 0.2s;
        background: var(--primary-light);
        color: var(--primary);
    }

    .watch-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 113, 227, 0.2);
    }

    .watch-btn.netflix { background: rgba(229, 9, 20, 0.1); color: var(--netflix); }
    .watch-btn.hbo_max { background: rgba(139, 92, 246, 0.1); color: var(--hbo); }
    .watch-btn.hulu { background: rgba(28, 231, 131, 0.15); color: #1a9f4d; }
    .watch-btn.disney_plus { background: rgba(17, 60, 207, 0.1); color: var(--disney); }
    .watch-btn.prime { background: rgba(0, 168, 225, 0.1); color: var(--prime); }

    .watch-btn svg {
        transition: transform 0.2s;
    }

    .watch-btn:hover svg {
        transform: translateX(2px);
    }
`;
document.head.appendChild(chartAnimations);
