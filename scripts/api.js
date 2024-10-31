const baseUrl = 'http://127.0.0.1:5000';

async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
    const url = `${baseUrl}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

export async function fetchRelatorio(funcionario, periodo) {
    const endpoint = `/registro/?funcionario=${funcionario}&periodo=${periodo}`;
    return await apiRequest(endpoint);
}

export async function login(email, password) {
    const endpoint = '/login';
    const body = { email, password };
    return await apiRequest(endpoint, 'POST', body);
}

export async function saveRegistro(body) {
    const endpoint = '/registro/salvar';
    const registro = body;
    return await apiRequest(endpoint, 'POST', registro);
}

export async function fetchHistoryUser(userId) {
    const endpoint = `/registro/${userId}`;
    return await apiRequest(endpoint);
}