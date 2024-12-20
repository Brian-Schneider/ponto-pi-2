import { login } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        try {
            const data = await login(email, password);
            console.log(data);
            if (data.success) {
                localStorage.setItem('id', data.id);
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('role', data.role);
                localStorage.setItem('nome', data.nome);
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