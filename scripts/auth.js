function isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'pages/login.html';
    }
}