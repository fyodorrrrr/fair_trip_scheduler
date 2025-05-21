let currentPage = 1;
let driversPerPage = 10;
let allDrivers = [];
let filteredDrivers = [];

function getAllRows() {
    return Array.from(document.querySelectorAll('#drivers-table tbody tr'));
}

document.addEventListener('DOMContentLoaded', function() {
    allDrivers = getAllRows();
    filteredDrivers = allDrivers.slice();
    displayDrivers();
});

function displayDrivers() {
    const tbody = document.querySelector('#drivers-table tbody');
    tbody.innerHTML = '';
    const startIndex = (currentPage - 1) * driversPerPage;
    const endIndex = startIndex + driversPerPage;
    const displayed = filteredDrivers.slice(startIndex, endIndex);
    displayed.forEach(row => tbody.appendChild(row));
    const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / driversPerPage));
    document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
}

function nextPage() {
    const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / driversPerPage));
    if (currentPage < totalPages) {
        currentPage++;
        displayDrivers();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayDrivers();
    }
}

function changePerPage(value) {
    driversPerPage = parseInt(value);
    currentPage = 1;
    displayDrivers();
}

function searchDrivers() {
    const searchTerm = document.getElementById('driver-search').value.toLowerCase();
    filteredDrivers = allDrivers.filter(row => {
        const driverName = row.cells[0].textContent.toLowerCase();
        return driverName.includes(searchTerm);
    });
    currentPage = 1;
    displayDrivers();
}

function filterDrivers() {
    const filterValue = document.getElementById('comp-filter').value;
    filteredDrivers = allDrivers.filter(row => {
        const compensation = parseFloat(row.cells[1].textContent.replace('₱', ''));
        if (filterValue === 'low') {
            return compensation < 50;
        } else if (filterValue === 'medium') {
            return compensation >= 50 && compensation <= 100;
        } else if (filterValue === 'high') {
            return compensation > 100;
        }
        return true;
    });
    currentPage = 1;
    displayDrivers();
}