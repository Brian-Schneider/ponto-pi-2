import { requireAuth } from './auth.js';
import { updateTime, nomeFuncionarioLogado } from './utils.js';
import { fetchFuncionarios, criarFuncionario, atualizarFuncionario } from './api.js';
import { logout } from './logout.js';

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    nomeFuncionarioLogado();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        logout();
    });
    
    const formCriarFuncionario = document.getElementById('formCriarFuncionario');
    const formAtualizarFuncionario = document.getElementById('formAtualizarFuncionario');
    const tabelaFuncionarios = document.getElementById('tabelaFuncionarios');

    formCriarFuncionario.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById('email').value;
        const cargo = document.getElementById('cargo').value;
        const role = document.getElementById('nivelAcesso').value;
        const password = document.getElementById('senha').value;

        try {
            const body = {
                nome: nome,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role,
                password: password
            }
            await criarFuncionario(body);
            fecharFormCriar();
            popularTabelaFuncionarios();
        } catch (error) {
            alert('Erro ao criar funcionário');
        }
    });

    formAtualizarFuncionario.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('atualizarId').value;
        const nome = document.getElementById('atualizarNome').value;
        const sobrenome = document.getElementById('atualizarSobrenome').value;
        const email = document.getElementById('atualizarEmail').value;
        const cargo = document.getElementById('atualizarCargo').value;
        const role = document.getElementById('atualizarNivelAcesso').value;
        const password = document.getElementById('atualizarSenha').value;

        try {

            const body = {
                id: id,
                nome: nome,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role,
                password: password
            }

            await atualizarFuncionario(body);
            fecharFormAtualizar();
            popularTabelaFuncionarios();
        } catch (error) {
            alert('Erro ao atualizar funcionário');
        }
    });

    function abrirFormCriar() {
        document.getElementById('formCriar').style.display = 'block';
    }

    function fecharFormCriar() {
        document.getElementById('formCriar').style.display = 'none';
    }

    function abrirFormAtualizar(id, nome, sobrenome, email, cargo, role) {
        document.getElementById('atualizarId').value = id;
        document.getElementById('atualizarNome').value = nome;
        document.getElementById('atualizarSobrenome').value = sobrenome;
        document.getElementById('atualizarEmail').value = email;
        document.getElementById('atualizarCargo').value = cargo;
        document.getElementById('atualizarNivelAcesso').value = role;
        document.getElementById('formAtualizar').style.display = 'block';
    }

    function fecharFormAtualizar() {
        document.getElementById('formAtualizar').style.display = 'none';
    }

    function abrirModalDetalhes(detalhes) {
        document.getElementById('detalhesFuncionario').innerText = detalhes;
        document.getElementById('modalDetalhes').style.display = 'block';
    }

    function fecharModalDetalhes() {
        document.getElementById('modalDetalhes').style.display = 'none';
    }

    async function popularTabelaFuncionarios() {
        try {
            const funcionarios = await fetchFuncionarios();
            tabelaFuncionarios.innerHTML = '';

            funcionarios.forEach(funcionario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome} ${funcionario.sobrenome}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.cargo}</td>
                    <td>${funcionario.role_id === 1 ? 'admin' : 'usuario'}</td>
                    <td>
                        <button onclick="abrirFormAtualizar(${funcionario.id}, '${funcionario.nome}', '${funcionario.sobrenome}', '${funcionario.email}', '${funcionario.cargo}', '${funcionario.role_id}')">Atualizar</button>
                        <button onclick="abrirModalDetalhes('ID: ${funcionario.id}\\nNome: ${funcionario.nome} ${funcionario.sobrenome}\\nEmail: ${funcionario.email}\\nCargo: ${funcionario.cargo}')">Detalhes</button>
                    </td>
                `;
                tabelaFuncionarios.appendChild(row);
            });
        } catch (error) {
            tabelaFuncionarios.innerHTML = '<tr><td colspan="4">Erro ao carregar funcionários</td></tr>';
        }
    }

    window.abrirFormCriar = abrirFormCriar;
    window.fecharFormCriar = fecharFormCriar;
    window.abrirFormAtualizar = abrirFormAtualizar;
    window.fecharFormAtualizar = fecharFormAtualizar;
    window.abrirModalDetalhes = abrirModalDetalhes;
    window.fecharModalDetalhes = fecharModalDetalhes;

    setInterval(updateTime, 1000);
    updateTime();

    popularTabelaFuncionarios();
});