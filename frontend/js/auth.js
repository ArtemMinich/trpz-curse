let currentUser = null;

async function initAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await api.getProfile();
            currentUser = response;
            updateAuthUI();
            showPage('opportunities');
        } catch (error) {
            localStorage.removeItem('token');
            showPage('login');
        }
    } else {
        showPage('login');
    }
}

function updateAuthUI() {
    const navLinks = document.getElementById('navLinks');
    const authLinks = document.getElementById('authLinks');
    const userGreeting = document.getElementById('userGreeting');

    if (currentUser) {
        navLinks.classList.remove('hidden');
        authLinks.classList.add('hidden');
        userGreeting.textContent = `Привіт, ${currentUser.name}!`;
    } else {
        navLinks.classList.add('hidden');
        authLinks.classList.remove('hidden');
        userGreeting.textContent = '';
    }
}

function logout() {
    api.logout();
    currentUser = null;
    updateAuthUI();
    showPage('login');
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await api.login(credentials);
        currentUser = response.user;
        updateAuthUI();
        showPage('opportunities');
        errorDiv.classList.remove('show');
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
});

// Register form handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    // Handle interests checkboxes
    const interests = Array.from(e.target.querySelectorAll('input[name="interests"]:checked'))
        .map(cb => cb.value);
    userData.interests = interests;

    const errorDiv = document.getElementById('registerError');
    console.log('Registration data:', userData);

    try {
        const response = await api.register(userData);
        currentUser = response.user;
        updateAuthUI();
        showPage('opportunities');
        errorDiv.classList.remove('show');
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = error.message;
        if (error.message.includes('errors')) {
            errorMessage = 'Перевірте правильність заповнення всіх полів';
        }
        errorDiv.textContent = errorMessage;
        errorDiv.classList.add('show');
    }
});

// Profile form handler
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    // Handle interests checkboxes
    const interests = Array.from(e.target.querySelectorAll('input[name="interests"]:checked'))
        .map(cb => cb.value);
    userData.interests = interests;

    const messageDiv = document.getElementById('profileMessage');
    const avatarFile = formData.get('avatar');

    try {
        const response = await api.updateProfile(userData);
        currentUser = response;

        if (avatarFile && avatarFile.size > 0) {
            const avatarFormData = new FormData();
            avatarFormData.append('avatar', avatarFile);
            await api.uploadAvatar(avatarFormData);
        }

        messageDiv.textContent = 'Профіль успішно оновлено!';
        messageDiv.className = 'message success show';
        updateAuthUI();
    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = 'message error show';
    }
});

function loadProfileData() {
    if (!currentUser) return;

    const form = document.getElementById('profileForm');
    form.name.value = currentUser.name || '';
    form.email.value = currentUser.email || '';
    form.region.value = currentUser.region || '';
    form.educationLevel.value = currentUser.educationLevel || '';

    // Set interests checkboxes
    const interestCheckboxes = form.querySelectorAll('input[name="interests"]');
    interestCheckboxes.forEach(cb => {
        cb.checked = currentUser.interests && currentUser.interests.includes(cb.value);
    });
}