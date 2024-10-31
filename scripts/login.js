import { login } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        try {
            const data = await login(email, password);
            if (data.success) {
                localStorage.setItem('id', data.id);
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('role', data.role);
                window.location.href = '/';
            } else {
                alert('Email e/ou senha inválidos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Email e/ou senha inválidos');
        }
    });
});