export function updateTime() {
    const horaAtualElement = document.getElementById('hora-atual');
    
    const now = new Date();
    horaAtualElement.textContent = now.toLocaleString();
}

export const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

export function nomeFuncionarioLogado(){
    const nomeFuncionario = localStorage.getItem('nome');
    if(nomeFuncionario) {
        document.getElementById('nome-funcionario').innerText = `Olá, ${nomeFuncionario}`;
    }
}