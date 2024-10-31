import { requireAuth } from './auth.js';
import { debounce, updateTime } from './utils.js';
import { fetchRelatorio } from './api.js';

document.addEventListener('DOMContentLoaded', () => {

    
    requireAuth();

    const filtrarButton = document.getElementById('filter-button');
    const inicioPeriodoSelect = document.getElementById('periodo-inicio');
    const fimPeriodoSelect = document.getElementById('periodo-fim');
    const funcionarioInput = document.getElementById('funcionario');
    const tabelaRelatorio = document.querySelector('#tabela-registros tbody');


    filtrarButton.addEventListener('click', debounce(async () => {
        const inicioPeriodo = inicioPeriodoSelect.value;
        const fimPeriodo = fimPeriodoSelect.value;
        const funcionario = funcionarioInput.value.trim();

        if (!inicioPeriodo || !fimPeriodo) {
            alert('Por favor, selecionar as datas.');
            return;
        }

        const periodo = `${inicioPeriodo},${fimPeriodo}`;
        try {
            const data = await fetchRelatorio(funcionario, periodo);
            tabelaRelatorio.innerHTML = ''; // Clear the current table body

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
                tabelaRelatorio.appendChild(row);
            });
        } catch (error) {
            tabelaRelatorio.innerHTML = '<tr><td colspan="6">Erro ao carregar Relatório</td></tr>'; // Show error message
        }
    }, 300));

    setInterval(updateTime, 1000);
    updateTime();

    const diaHoje = new Date().toISOString().split('T')[0];
    fetchRelatorio('', `${diaHoje},${diaHoje}`).then(data => {
        tabelaRelatorio.innerHTML = ''; // Clear the current table body

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
            tabelaRelatorio.appendChild(row);
        });
    }).catch(error => {
        tabelaRelatorio.innerHTML = '<tr><td colspan="6">Erro ao carregar Relatório</td></tr>'; // Show error message
    });
});