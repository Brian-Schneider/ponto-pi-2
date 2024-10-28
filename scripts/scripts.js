document.addEventListener('DOMContentLoaded', () => {

    requireAuth();

    const currentTimeElement = document.getElementById('current-time');
    const historyList = document.getElementById('history-list');
    const apiUrl = 'http://127.0.0.1:5000';

    const saveTimeEndpoint = `${baseUrl}/save_time`;
    const loadHistoryEndpoint = `${baseUrl}/load_history`;


    let currentEntry = {
        user: localStorage.getItem('id'),
        date: new Date().toLocaleDateString(),
        entrada: '',
        intervalo: '',
        retorno: '',
        saida: ''
    };

    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }

    async function addHistoryEntry(timeField) {
        const now = new Date();
        const timeValue = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });        // Send the entry to the backend
        try {
            const response = await fetch(saveTimeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: currentEntry.user,
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

    async function loadHistoryUser(userId) {
        // Retrieve the history from the backend
        try {
            const response = await fetch(`${loadHistoryEndpoint}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            historyList.innerHTML = ''; // Clear the current list
    
            // Get the current date and the date 5 days prior
            const currentDate = new Date();
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 5);
    
            // Filter the data to include only entries within the desired date range
            const filteredData = data.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= pastDate && entryDate <= currentDate;
            });
    
            // Populate the history list with the filtered data
            filteredData.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.user} - ${entry.date} - Entrada: ${entry.entrada} - Intervalo: ${entry.intervalo} - Retorno: ${entry.retorno} - Saída: ${entry.saida}`;
                historyList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    document.getElementById('entrada').addEventListener('click', () => addHistoryEntry('entrada'));
    document.getElementById('intervalo').addEventListener('click', () => addHistoryEntry('intervalo'));
    document.getElementById('retorno').addEventListener('click', () => addHistoryEntry('retorno'));
    document.getElementById('saida').addEventListener('click', () => addHistoryEntry('saida'));

    setInterval(updateTime, 1000);
    updateTime();

    if (userId) {
        loadHistoryUser(localStorage.getItem('id'));
    } else {
        console.error('User ID not found');
    }
});