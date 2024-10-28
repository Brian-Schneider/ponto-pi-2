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
    const historyList = document.getElementById('history-list');
    const baseUrl = 'http://127.0.0.1:5000';

    const saveTimeEndpoint = `${baseUrl}/save_time`;
    const loadHistoryEndpoint = `${baseUrl}/object`;
    const loadRelatorioEndpoint = `${baseUrl}/relatorio`;

    async function loadRelatorioView() {
        const response = await fetch('/relatorio');
        const html = await response.text();
    
        // Fetch and display data based on filters
        document.getElementById('filter-button').addEventListener('click', () => {
            const period = document.getElementById('period').value;
            const employee = document.getElementById('employee').value;
            fetchFilteredData(period, employee);
        });
    
        async function fetchFilteredData(period, employee) {
            const response = await fetch(`/relatorio?period=${period}&employee=${employee}`);
            
            if (!response.ok) {
                const error = await response.json();
                alert(error.error);
                return;
            }
    
            const data = await response.json();
    
            const tbody = document.getElementById('history-table').querySelector('tbody');
            tbody.innerHTML = '';
            data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.date}</td>
                    <td>${record.entrada}</td>
                    <td>${record.intervalo}</td>
                    <td>${record.retorno}</td>
                    <td>${record.saida}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }

    let currentEntry = {
        user: localStorage.getItem('id'),
        date: new Date().toLocaleDateString(),
        entrada: '',
        intervalo: '',
        retorno: '',
        saida: ''
    };

    function updateTime() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleString();
    }

    async function addHistoryEntry(timeField) {
        const now = new Date();
        const timeValue = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
    
        // Send the entry to the backend
        try {
            const response = await fetch(saveTimeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: currentEntry.user,
                    date: currentEntry.date,
                    time_field: timeField,
                    time_value: timeValue
                })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
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
                const entryDate = new Date(entry.date);
                return entryDate >= pastDate && entryDate <= currentDate;
            });
    
            // Sort the filtered data in descending order by date
            filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
            function formatDate(date) {
                return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
            }

            // Populate the table with the sorted data
            filteredData.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(entry.date)}</td>
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

    loadRelatorioView()

    const userId = localStorage.getItem('id');

    if (userId) {
        loadHistoryUser(userId);
    } else {
        console.error('User ID not found');
    }
});

