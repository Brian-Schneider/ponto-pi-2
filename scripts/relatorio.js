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
    const periodoStartSelect = document.getElementById('periodo-start');
    const periodoEndSelect = document.getElementById('periodo-end');
    const funcionarioInput = document.getElementById('funcionario');
    const reportTableBody = document.querySelector('#history-table tbody');
    const baseUrl = 'http://127.0.0.1:5000';

    const debounce = (func, delay) => {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };


    async function fetchReport(funcionario, periodo) {
        try {
            reportTableBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>'; // Show loading indicator

            const response = await fetch(`${baseUrl}/registro?funcionario=${funcionario}&periodo=${periodo}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            reportTableBody.innerHTML = ''; // Clear the current table body

            data.forEach(entry => {
                console.log(entry);
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
            console.error('Error:', error);
            reportTableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>'; // Show error message

        }
    }

    filterButton.addEventListener('click', debounce(() => {
        const periodoStart = periodoStartSelect.value;
        const periodoEnd = periodoEndSelect.value;
        const funcionario = funcionarioInput.value.trim();

        if (!periodoStart || !periodoEnd) {
            alert('Por favor, selecionar as datas.');
            return;
        }

        const periodo = periodoStart + ',' + periodoEnd;
        fetchReport(funcionario, periodo);
    }, 300));


    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }




    setInterval(updateTime, 1000);
    updateTime();

    const today = new Date().toISOString().split('T')[0];
    fetchReport('', today + ',' + today);

});