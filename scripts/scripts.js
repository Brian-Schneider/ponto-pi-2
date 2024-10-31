import { requireAuth } from './auth.js';
import { updateTime } from './utils.js';
import { saveRegistro, fetchHistoryUser } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    requireAuth();


    let registro = {
        funcionario: localStorage.getItem('id'),
        dia: new Date().toLocaleDateString(),
        entrada: '',
        intervalo: '',
        retorno: '',
        saida: ''
    };


    async function addHistoryEntry(campoTempo) {
        const now = new Date();
        const valorTempo = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    
        // Send the entry to the backend
        try {
            const body = {
                funcionario: registro.funcionario,
                dia: registro.dia,
                campo_tempo: campoTempo,
                valor_tempo: valorTempo
            }
            
            await saveRegistro (body);
    
            // Refresh the table to show the latest data
            const userId = localStorage.getItem('id'); // Adjust this line based on where you store the userId
            if (userId) {
                await listaRegistroUsuario(userId);
            } else {
                console.error('ID de usuário não encontrado');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function listaRegistroUsuario(userId) {
        try {
            const response = await fetchHistoryUser(userId);
    

            const tabelaRegistros = document.querySelector('#tabela-registros tbody');
            tabelaRegistros.innerHTML = '';
    
            // Get the current date and the date 5 days prior
            const dataAtual = new Date();
            const dataPassada = new Date();
            dataPassada.setDate(dataAtual.getDate() - 6);
    
            // Filter the data to include only entries within the desired date range
            const datasFiltradas = response.filter(entry => {
                const entryDia = new Date(entry.dia);
                return entryDia >= dataPassada && entryDia <= dataAtual;
            });
    
            // Sort the filtered response in descending order by date
            datasFiltradas.sort((a, b) => new Date(b.dia) - new Date(a.dia));
    
            function formatDate(dia) {
                return new Intl.DateTimeFormat('pt-BR').format(new Date(dia));
            }

            // Populate the table with the sorted data
            datasFiltradas.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(entry.dia)}</td>
                    <td>${entry.entrada || ''}</td>
                    <td>${entry.intervalo || ''}</td>
                    <td>${entry.retorno || ''}</td>
                    <td>${entry.saida || ''}</td>
                `;
                tabelaRegistros.appendChild(row);
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
        listaRegistroUsuario(userId);
    } else {
        console.error('ID de usuário não encontrado');
    }
});