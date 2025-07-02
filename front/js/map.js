// Map initialization
const map = L.map('map').setView([48.379433, 31.165581], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load and display opportunities on the map
async function loadOpportunities() {
    try {
        const response = await fetch('http://localhost:5000/api/opportunities');
        const opportunities = await response.json();
        
        const opportunitiesByRegion = {};
        opportunities.forEach(opportunity => {
            if (!opportunitiesByRegion[opportunity.region]) {
                opportunitiesByRegion[opportunity.region] = [];
            }
            opportunitiesByRegion[opportunity.region].push(opportunity);
        });

        // Add markers for each region
        Object.entries(opportunitiesByRegion).forEach(([region, opps]) => {
            const marker = L.marker(getRegionCoordinates(region))
                .addTo(map)
                .on('click', () => showOpportunities(region, opps));
        });
    } catch (error) {
        console.error('Error loading opportunities:', error);
    }
}

// Show opportunities panel when clicking on a region
function showOpportunities(region, opportunities) {
    const panel = document.getElementById('opportunities-panel');
    const list = document.getElementById('opportunities-list');
    
    list.innerHTML = opportunities.map(opp => `
        <div class="opportunity">
            <h3>${opp.title}</h3>
            <p>${opp.description}</p>
            <div class="tags">
                ${opp.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ${opp.link ? `<a href="${opp.link}" target="_blank">Детальніше</a>` : ''}
        </div>
    `).join('');

    panel.classList.remove('hidden');
}

// Helper function to get coordinates for regions
function getRegionCoordinates(region) {
    const coordinates = {
        'Київ': [50.4501, 30.5234],
        'Львів': [49.8397, 24.0297],
        // Add more regions as needed
    };
    return coordinates[region] || [48.379433, 31.165581];
}

// Initialize the map
loadOpportunities();
