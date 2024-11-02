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

export function controleAcesso() {
    const nivelDeAcesso = getUserRole();

    // Exemplo de controle de acesso
    if (nivelDeAcesso === "user") { // Supondo que 2 é o nível necessário para acessar o relatório
        document.getElementById('funcionarios-link').style.display = 'none';
        document.getElementById('relatorio-link').style.display = 'none';
    }
}