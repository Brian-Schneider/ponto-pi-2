document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        fetch('http://127.0.0.1:5000/login/', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methods':'POST',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('role', data.role);
                window.location.href = '/index.html';
            } else {
                console.log(data);
                alert('Email e/ou senha inválidos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Email e/ou senha inválidos');
        });
    });
});