import { requireAuth } from './auth.js';
import { updateTime } from './utils.js';
import { fetchEmployees, createEmployee, updateEmployee } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    const createEmployeeForm = document.getElementById('createEmployeeForm');
    const updateEmployeeForm = document.getElementById('updateEmployeeForm');
    const employeeTable = document.getElementById('employeeTable');

    createEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById('email').value;
        const cargo = document.getElementById('position').value;
        const role = document.getElementById('nivelAcesso').value;
        const password = document.getElementById('senha').value;

        try {
            const body = {
                nome: name,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role,
                password: password
            }
            await createEmployee(body);
            closeCreateForm();
            populateEmployeeTable();
        } catch (error) {
            alert('Erro ao criar funcionário');
        }
    });

    updateEmployeeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('updateId').value;
        const name = document.getElementById('updateName').value;
        const sobrenome = document.getElementById('updateSobrenome').value;
        const email = document.getElementById('updateEmail').value;
        const cargo = document.getElementById('updatePosition').value;
        const role = document.getElementById('updateNivelAcesso').value;
        const password = document.getElementById('updateSenha').value;

        try {

            const body = {
                id: id,
                nome: name,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role,
                password: password
            }

            await updateEmployee(body);
            closeUpdateForm();
            populateEmployeeTable();
        } catch (error) {
            alert('Erro ao atualizar funcionário');
        }
    });

    function openCreateForm() {
        document.getElementById('createForm').style.display = 'block';
    }

    function closeCreateForm() {
        document.getElementById('createForm').style.display = 'none';
    }

    function openUpdateForm(id, name, sobrenome, email, position, role) {
        document.getElementById('updateId').value = id;
        document.getElementById('updateName').value = nome;
        document.getElementById('updateSobrenome').value = sobrenome;
        document.getElementById('updateEmail').value = email;
        document.getElementById('updatePCargo').value = position;
        document.getElementById('updateNivelAcesso').value = role;
        document.getElementById('updateForm').style.display = 'block';
    }

    function closeUpdateForm() {
        document.getElementById('updateForm').style.display = 'none';
    }

    function openDetailsModal(details) {
        document.getElementById('employeeDetails').innerText = details;
        document.getElementById('detailsModal').style.display = 'block';
    }

    function closeDetailsModal() {
        document.getElementById('detailsModal').style.display = 'none';
    }

    async function populateEmployeeTable() {
        try {
            const employees = await fetchEmployees();
            employeeTable.innerHTML = '';

            employees.forEach(employee => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.nome}</td>
                    <td>${employee.sobrenome}</td>
                    <td>${employee.email}</td>
                    <td>${employee.cargo}</td>
                    <td>${employee.role_id}</td>
                    <td>
                        <button onclick="openUpdateForm(${employee.id}, '${employee.nome}', '${employee.sobrenome}', '${employee.email}', '${employee.cargo}', '${employee.role_id}')">Update</button>
                        <button onclick="openDetailsModal('ID: ${employee.id}\\nNome: ${employee.nome} ${employee.sobrenome}\\nEmail: ${employee.email}\\nCargo: ${employee.cargo}')">Details</button>
                    </td>
                `;
                employeeTable.appendChild(row);
            });
        } catch (error) {
            employeeTable.innerHTML = '<tr><td colspan="4">Erro ao carregar funcionários</td></tr>';
        }
    }

    window.openCreateForm = openCreateForm;
    window.closeCreateForm = closeCreateForm;
    window.openUpdateForm = openUpdateForm;
    window.closeUpdateForm = closeUpdateForm;
    window.openDetailsModal = openDetailsModal;
    window.closeDetailsModal = closeDetailsModal;

    setInterval(updateTime, 1000);
    updateTime();

    populateEmployeeTable();
});