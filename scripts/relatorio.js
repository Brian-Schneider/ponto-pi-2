document.addEventListener('DOMContentLoaded', () => {

    const navigateTo = url => {
        history.pushState(null, null, url);
        router();
    };

    const router = async () => {
        const routes = [
            { path: "/", view: () => "Welcome to the Home Page" },
            { path: "/pages/about.html", view: () => "Learn more About Us" },
            { path: "/pages/contact.html", view: () => "Contact Us Here" },
            { path: "/pages/login.html", view: () => "Login to Your Account" }
        ];

        const potentialMatches = routes.map(route => {
            return {
                route: route,
                isMatch: location.pathname === route.path
            };
        });

        let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

        if (!match) {
            match = {
                route: routes[0],
                isMatch: true
            };
        }

        document.querySelector("#app").innerHTML = await match.route.view();
    };

    window.addEventListener("popstate", router);

    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
    
    requireAuth();

    const currentTimeElement = document.getElementById('current-time');
    const filterButton = document.getElementById('filter-button');
    const periodStartSelect = document.getElementById('period-start');
    const periodEndSelect = document.getElementById('period-end');
    const employeeInput = document.getElementById('employee');
    const reportTableBody = document.querySelector('#history-table tbody');
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
                    <td>${entry.date}</td>
                    <td>${entry.user}</td>
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

    filterButton.addEventListener('click', () => {
        const periodStart = periodStartSelect.value;
        const periodEnd = periodEndSelect.value;
        const employee = employeeInput.value;
        if (!periodStart || !periodEnd) {
            alert('Por favor, selecionar as datas.');
            return;
        }

        const period = periodStart + ',' + periodEnd;
        fetchReport(employee, period);
    });


    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }




    setInterval(updateTime, 1000);
    updateTime();

    const today = new Date().toISOString().split('T')[0];
    fetchReport('', today + ',' + today);

});