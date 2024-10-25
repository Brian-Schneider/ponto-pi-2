document.addEventListener('DOMContentLoaded', () => {
    
    requireRole();

});


function getUserRole() {
    return localStorage.getItem('role'); 
}

function requireRole() {
    const role =  getUserRole();
    if (role !== 'admin') {
        window.location.href = 'index.html';
    }
}