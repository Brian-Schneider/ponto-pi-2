import { requireAuth } from './auth.js';
import { debounce, updateTime } from './utils.js';
import { fetchRelatorio, saveRegistro } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    requireAuth();


    const currentTimeElement = document.getElementById('current-time');
    const historyList = document.getElementById('history-list');
    const baseUrl = 'http://127.0.0.1:5000';

    const saveTimeEndpoint = `${baseUrl}/registro/salvar`;
    const loadHistoryEndpoint = `${baseUrl}/registro`;


    let currentEntry = {
        funcionario: localStorage.getItem('id'),
        dia: new Date().toLocaleDateString(),
        entrada: '',
        intervalo: '',
        retorno: '',
        saida: ''
    };

    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }

    async function addHistoryEntry(campoTempo) {
        const now = new Date();
        const valorTempo = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    
        // Send the entry to the backend
        try {
            body = {
                funcionario: currentEntry.funcionario,
                dia: currentEntry.dia,
                campo_tempo: campoTempo,
                valor_tempo: valorTempo
            }
            const data = await saveRegistro (body);
            if (data.success) {
                alert('Registro salvo com sucesso');
            } else {
                alert('Erro ao salvar registro');
            }
            
            
    
            // Refresh the table to show the latest data
            const userId = localStorage.getItem('id'); // Adjust this line based on where you store the userId
            if (userId) {
                await loadHistoryUser(userId);
            } else {
                console.error('User ID not found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadHistory() {
        // Retrieve the history from the backend
        try {
            const response = await fetch(baseUrl);
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
        try {
            const response = await fetch(`${loadHistoryEndpoint}/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            const historyTableBody = document.querySelector('#history-table tbody');
            historyTableBody.innerHTML = ''; // Clear the current table body
    
            // Get the current date and the date 5 days prior
            const currentDate = new Date();
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 6);
    
            // Filter the data to include only entries within the desired date range
            const filteredData = data.filter(entry => {
                const entryDate = new Date(entry.dia);
                return entryDate >= pastDate && entryDate <= currentDate;
            });
    
            // Sort the filtered data in descending order by date
            filteredData.sort((a, b) => new Date(b.dia) - new Date(a.dia));
    
            function formatDate(dia) {
                return new Intl.DateTimeFormat('pt-BR').format(new Date(dia));
            }

            // Populate the table with the sorted data
            filteredData.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(entry.dia)}</td>
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