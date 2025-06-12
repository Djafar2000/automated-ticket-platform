document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:5000';
    const token = localStorage.getItem('token');
    const path = window.location.pathname;

    // --- Page Routing Logic ---
    if (token && path.includes('login.html')) {
        // If logged in and on login page, go to dashboard
        window.location.href = '/';
    } else if (!token && !path.includes('login.html')) {
        // If not logged in and not on login page, go to login
        window.location.href = '/login-page';
    }

    // --- Element Selectors ---
    // Login & Register
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    
    // Dashboard
    const botForm = document.getElementById('bot-form');
    const botStatus = document.getElementById('bot-status');
    const logoutButton = document.getElementById('logout-button');
    
    // --- Event Listeners ---
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (botForm) {
        botForm.addEventListener('submit', handleStartBot);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // --- Form Toggling ---
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.style.display = 'none';
            registerContainer.style.display = 'block';
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // --- Handler Functions ---
    async function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.access_token);
                window.location.href = '/'; // Redirect to dashboard
            } else {
                loginMessage.textContent = data.msg;
                loginMessage.style.color = 'red';
            }
        } catch (error) {
            loginMessage.textContent = 'Network error. Is the server running?';
            loginMessage.style.color = 'red';
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                registerMessage.textContent = 'Registration successful! Please login.';
                registerMessage.style.color = 'green';
            } else {
                registerMessage.textContent = data.msg;
                registerMessage.style.color = 'red';
            }
        } catch (error) {
            registerMessage.textContent = 'Network error.';
            registerMessage.style.color = 'red';
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = '/login-page';
    }

    async function handleStartBot(e) {
        e.preventDefault();
        const event_name = document.getElementById('event-name').value;
        const currentToken = localStorage.getItem('token');
        
        botStatus.textContent = 'Starting bot... A new browser window should open.';
        botStatus.style.color = 'blue';

        try {
            const response = await fetch(`${API_URL}/start-bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ event_name })
            });
            const data = await response.json();
            if (response.ok) {
                botStatus.textContent = `Bot finished. Status: ${data.msg}`;
                botStatus.style.color = 'green';
            } else {
                botStatus.textContent = `Error: ${data.msg}`;
                botStatus.style.color = 'red';
            }
        } catch (error) {
            botStatus.textContent = 'Network error.';
            botStatus.style.color = 'red';
        }
    }
});