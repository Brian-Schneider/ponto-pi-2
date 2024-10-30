import { requireAuth } from './auth.js';
import { debounce, updateTime } from './utils.js';
import { fetchReport } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    
    requireAuth();

    const filterButton = document.getElementById('filter-button');
    const periodoStartSelect = document.getElementById('periodo-start');
    const periodoEndSelect = document.getElementById('periodo-end');
    const funcionarioInput = document.getElementById('funcionario');
    const reportTableBody = document.querySelector('#history-table tbody');


    filterButton.addEventListener('click', debounce(async () => {
        const periodoStart = periodoStartSelect.value;
        const periodoEnd = periodoEndSelect.value;
        const funcionario = funcionarioInput.value.trim();

        if (!periodoStart || !periodoEnd) {
            alert('Por favor, selecionar as datas.');
            return;
        }

        const periodo = `${periodoStart},${periodoEnd}`;
        try {
            const data = await fetchReport(funcionario, periodo);
            reportTableBody.innerHTML = ''; // Clear the current table body

            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.dia}</td>
                    <td>${entry.funcionario}</td>
                    <td>${entry.entrada || ''}</td>
                    <td>${entry.intervalo || ''}</td>
                    <td>${entry.retorno || ''}</td>
                    <td>${entry.saida || ''}</td>
                `;
                reportTableBody.appendChild(row);
            });
        } catch (error) {
            reportTableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>'; // Show error message
        }
    }, 300));

    setInterval(updateTime, 1000);
    updateTime();

    const today = new Date().toISOString().split('T')[0];
    fetchReport('', `${today},${today}`).then(data => {
        reportTableBody.innerHTML = ''; // Clear the current table body

        data.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.dia}</td>
                <td>${entry.funcionario}</td>
                <td>${entry.entrada || ''}</td>
                <td>${entry.intervalo || ''}</td>
                <td>${entry.retorno || ''}</td>
                <td>${entry.saida || ''}</td>
            `;
            reportTableBody.appendChild(row);
        });
    }).catch(error => {
        reportTableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>'; // Show error message
    });
});