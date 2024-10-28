document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('report-form');
    const reportTableBody = document.querySelector('#report-table tbody');
    const baseUrl = 'http://127.0.0.1:5000';

    async function fetchReport(employee, period) {
        try {
            const response = await fetch(`${baseUrl}/relatorio?employee=${employee}&period=${period}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            reportTableBody.innerHTML = ''; // Clear the current table body

            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.id}</td>
                    <td>${entry.date}</td>
                    <td>${entry.entrada || ''}</td>
                    <td>${entry.intervalo || ''}</td>
                    <td>${entry.retorno || ''}</td>
                    <td>${entry.saida || ''}</td>
                `;
                reportTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const employee = document.getElementById('employee').value;
            const period = document.getElementById('period').value;
            fetchReport(employee, period);
        });
    }

    const currentTimeElement = document.getElementById('current-time');
    const historyList = document.getElementById('history-list');

    const saveTimeEndpoint = `${baseUrl}/save_time`;
    const loadHistoryEndpoint = `${baseUrl}/object`;

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
        const timeValue = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });

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

            const userId = localStorage.getItem('id');
            if (userId) {
                await loadHistoryUser(userId);
            } else {
                console.error('User ID not found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadHistoryUser(userId) {
        try {
            const response = await fetch(`${loadHistoryEndpoint}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const historyTableBody = document.querySelector('#history-table tbody');
            historyTableBody.innerHTML = ''; // Clear the current table body

            const currentDate = new Date();
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 6);

            const filteredData = data.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= pastDate && entryDate <= currentDate;
            });

            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

            filteredData.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.date}</td>
                    <td>${entry.entrada || ''}</td>
                    <td>${entry.intervalo || ''}</td>
                    <td>${entry.retorno || ''}</td>
                    <td>${entry.saida || ''}</td>
                `;
                historyTableBody.appendChild(row);
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

    const userId = localStorage.getItem('id');

    if (userId) {
        loadHistoryUser(userId);
    } else {
        console.error('User ID not found');
    }
});