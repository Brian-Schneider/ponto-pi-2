document.addEventListener('DOMContentLoaded', () => {

    requireAuth();

    const currentTimeElement = document.getElementById('current-time');
    const historyList = document.getElementById('history-list');
    const apiUrl = 'http://127.0.0.1:5000/save_time';

    let currentEntry = {
        name: 'John Doe', // Replace with actual name
        register: '12345', // Replace with actual register number
        date: new Date().toLocaleDateString(),
        time1: '',
        time2: '',
        time3: '',
        time4: ''
    };

    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }

    async function addHistoryEntry(timeField) {
        const now = new Date();
        const timeValue = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
        // Send the entry to the backend
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: currentEntry.name,
                    register: currentEntry.register,
                    date: currentEntry.date,
                    time_field: timeField,
                    time_value: timeValue
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Add the entry to the history list in the DOM
            const listItem = document.createElement('li');
            listItem.textContent = `${timeField} - ${currentEntry[timeField]}`;
            historyList.appendChild(listItem);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadHistory() {
        // Retrieve the history from the backend
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            historyList.innerHTML = ''; // Clear the current list

            // Populate the history list with the retrieved data
            data.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.type} - ${new Date(entry.timestamp).toLocaleString()}`;
                historyList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.getElementById('entrada').addEventListener('click', () => addHistoryEntry('time1'));
    document.getElementById('intervalo').addEventListener('click', () => addHistoryEntry('time2'));
    document.getElementById('retorno').addEventListener('click', () => addHistoryEntry('time3'));
    document.getElementById('saida').addEventListener('click', () => addHistoryEntry('time4'));

    setInterval(updateTime, 1000);
    updateTime();
    loadHistory();
});