let opportunities = [];

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Load page-specific data
    if (pageName === 'opportunities') {
        loadOpportunities();
    } else if (pageName === 'profile') {
        loadProfileData();
    }
}

async function loadOpportunities() {
    const grid = document.getElementById('opportunitiesGrid');
    grid.innerHTML = '<div class="loading">Завантаження...</div>';

    try {
        const filters = {
            type: document.getElementById('typeFilter')?.value || '',
            region: document.getElementById('regionFilter')?.value || '',
            tags: document.getElementById('tagsFilter')?.value || ''
        };

        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });

        const response = await api.getOpportunities(filters);
        opportunities = response;
        renderOpportunities();
    } catch (error) {
        grid.innerHTML = `<div class="error show">Помилка завантаження: ${error.message}</div>`;
    }
}

function renderOpportunities() {
    const grid = document.getElementById('opportunitiesGrid');
    
    if (opportunities.length === 0) {
        grid.innerHTML = '<div class="loading">Можливості не знайдено</div>';
        return;
    }

    const typeLabels = {
        job: 'Робота',
        course: 'Курси',
        news: 'Новини',
        project: 'Проекти'
    };

    grid.innerHTML = opportunities.data.map(opportunity => `
        <div class="opportunity-card">
            <h3>${escapeHtml(opportunity.title)}</h3>
            <p><strong>Тип:</strong> ${typeLabels[opportunity.type] || opportunity.type}</p>
            <p><strong>Регіон:</strong> ${escapeHtml(opportunity.region)}</p>
           
            ${opportunity.tags && opportunity.tags.length > 0 ? `
                <div class="opportunity-tags">
                    ${opportunity.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            <p><strong>Дата:</strong> ${new Date(opportunity.date).toLocaleDateString('uk-UA')}</p>
            ${opportunity.link ? `
                <a href="${escapeHtml(opportunity.link)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Детальніше
                </a>
            ` : ''}
        </div>
    `).join('');
}

async function triggerParsing() {
    try {
        await api.triggerParsing();
        alert('Парсинг запущено! Оновіть сторінку через кілька хвилин.');
    } catch (error) {
        alert('Помилка запуску парсингу: ' + error.message);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter event listeners
document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.getElementById('typeFilter');
    const regionFilter = document.getElementById('regionFilter');
    const tagsFilter = document.getElementById('tagsFilter');

    if (typeFilter) {
        typeFilter.addEventListener('change', loadOpportunities);
    }
    
    if (regionFilter) {
        regionFilter.addEventListener('input', debounce(loadOpportunities, 500));
    }
    
    if (tagsFilter) {
        tagsFilter.addEventListener('input', debounce(loadOpportunities, 500));
    }

    // Initialize auth
    initAuth();
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}