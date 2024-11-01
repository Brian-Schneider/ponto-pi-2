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

        try {
            const body = {
                name: name,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role
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

        try {

            const body = {
                id: id,
                name: name,
                sobrenome: sobrenome,
                email: email,
                cargo: cargo,
                role: role
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

    function openUpdateForm(id, name, position) {
        document.getElementById('updateId').value = id;
        document.getElementById('updateName').value = name;
        document.getElementById('updatePosition').value = position;
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
                        <button onclick="openUpdateForm(${employee.id}, '${employee.name}', '${employee.position}')">Update</button>
                        <button onclick="openDetailsModal('ID: ${employee.id}\\nName: ${employee.name}\\nPosition: ${employee.position}')">Details</button>
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