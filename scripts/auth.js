export function isAuthenticated() {
    return localStorage.getItem('accessToken') !== null;
}

export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
    }
}

export function getUserRole() {
    return localStorage.getItem('role'); 
}

export function requireRole(role) {
    const userRole = getUserRole();
    if (userRole !== role) {
        window.location.href = '/';
    }
}