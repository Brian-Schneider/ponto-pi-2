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


    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }




    setInterval(updateTime, 1000);
    updateTime();

    const userId = localStorage.getItem('id');

    if (userId) {
        loadHistoryUser(userId);
    } else {
        console.error('User ID not found');
    }
});