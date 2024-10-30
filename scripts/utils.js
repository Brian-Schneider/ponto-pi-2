export function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleString();
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