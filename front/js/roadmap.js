class Roadmap {
    constructor(userId) {
        this.userId = userId;
        this.container = document.getElementById('roadmap');
        this.loadRoadmap();
    }

    async loadRoadmap() {
        try {
            const response = await fetch(`http://localhost:5000/api/roadmap/${this.userId}`);
            const data = await response.json();
            this.render(data.steps);
        } catch (error) {
            console.error('Error loading roadmap:', error);
        }
    }

    render(steps) {
        this.container.innerHTML = steps.map((step, index) => `
            <div class="roadmap-step" data-index="${index}">
                <h3>${step.title}</h3>
                <p>${step.description}</p>
                <div class="step-status">
                    <select class="status-select" onchange="roadmap.updateStatus(${index}, this.value)">
                        <option value="not_started" ${step.status === 'not_started' ? 'selected' : ''}>Не почато</option>
                        <option value="in_progress" ${step.status === 'in_progress' ? 'selected' : ''}>В процесі</option>
                        <option value="completed" ${step.status === 'completed' ? 'selected' : ''}>Завершено</option>
                    </select>
                </div>
            </div>
        `).join('');
    }

    async updateStatus(stepIndex, newStatus) {
        try {
            const response = await fetch(`http://localhost:5000/api/roadmap/${this.userId}`);
            const data = await response.json();
            const steps = [...data.steps];
            steps[stepIndex].status = newStatus;

            await fetch(`http://localhost:5000/api/roadmap/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ steps }),
            });

            showNotification('Статус оновлено');
        } catch (error) {
            console.error('Error updating status:', error);
            showNotification('Помилка при оновленні статусу', 'error');
        }
    }
}

// Initialize roadmap with user ID (replace with actual user ID)
const roadmap = new Roadmap('user123');
