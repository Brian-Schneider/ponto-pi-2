export function logout() {
    localStorage.removeItem('id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('nome');
    window.location.href = '/login'; // Redireciona para a página de login
}