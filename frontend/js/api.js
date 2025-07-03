const API_BASE_URL = 'http://localhost:3001';

class API {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    async request(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
            config.body = JSON.stringify(config.body);
        }

        const response = await fetch(`${API_BASE_URL}${url}`, config);
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(error.message || 'Request failed');
        }

        return response.json();
    }

    // Auth API
    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: userData
        });
        this.token = response.token;
        localStorage.setItem('token', this.token);
        return response;
    }

    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: credentials
        });
        this.token = response.token;
        localStorage.setItem('token', this.token);
        return response;
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateProfile(userData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: userData
        });
    }

    async uploadAvatar(formData) {
        return this.request('/auth/upload-avatar', {
            method: 'POST',
            headers: {},
            body: formData
        });
    }

    // Opportunities API
    async getOpportunities(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/opportunities?${queryString}` : '/opportunities';
        return this.request(url);
    }

    async getOpportunityById(id) {
        return this.request(`/opportunities/${id}`);
    }

    async triggerParsing() {
        return this.request('/opportunities/parse', {
            method: 'POST'
        });
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
    }
}

const api = new API();