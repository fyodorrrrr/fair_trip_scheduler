let MAX_COMP, MIN_COMP;
let currentPage = 1;
const rowsPerPage = 10;
let allRows = [];
let filteredRows = [];

document.addEventListener('DOMContentLoaded', function() {
    // Get data from the hidden element
    const appData = document.getElementById('app-data');
    MAX_COMP = parseFloat(appData.dataset.maxComp);
    MIN_COMP = parseFloat(appData.dataset.minComp);
    
    allRows = Array.from(document.querySelectorAll('#results-body tr'));
    filteredRows = allRows.slice();
    
    setupPagination();
    showPage(1);
    
    createCompensationChart();
});

function setupPagination() {
    const pageCount = Math.ceil(filteredRows.length / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    if (pageCount > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.textContent = '←';
        prevBtn.onclick = () => {
            if (currentPage > 1) showPage(currentPage - 1);
        };
        pagination.appendChild(prevBtn);
    }
    
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn';
        if (i === currentPage) btn.classList.add('active');
        btn.textContent = i;
        btn.onclick = () => showPage(i);
        pagination.appendChild(btn);
    }
    
    if (pageCount > 1) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.textContent = '→';
        nextBtn.onclick = () => {
            if (currentPage < pageCount) showPage(currentPage + 1);
        };
        pagination.appendChild(nextBtn);
    }
}

function showPage(page) {
    currentPage = page;
    const tbody = document.getElementById('results-body');
    tbody.innerHTML = '';
    
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedRows = filteredRows.slice(start, end);
    
    paginatedRows.forEach(row => {
        tbody.appendChild(row);
    });
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === page.toString()) {
            btn.classList.add('active');
        }
    });
}

function searchDrivers() {
    const searchTerm = document.getElementById('driver-search').value.toLowerCase();
    filteredRows = allRows.filter(row => {
        const driverName = row.querySelector('th').textContent.toLowerCase();
        return driverName.includes(searchTerm);
    });
    
    setupPagination();
    showPage(1);
}

function filterDrivers() {
    const filter = document.getElementById('earnings-filter').value;
    
    filteredRows = allRows.filter(row => {
        const comp = parseFloat(row.getAttribute('data-compensation'));
        const maxComp = MAX_COMP;
        const minComp = MIN_COMP;
        const avgComp = (maxComp + minComp) / 2;
        
        if (filter === 'high') return comp > avgComp;
        if (filter === 'low') return comp < avgComp * 0.7;
        if (filter === 'medium') return comp >= avgComp * 0.7 && comp <= avgComp * 1.3;
        return true;
    });
    
    setupPagination();
    showPage(1);
}

function sortByCompensation() {
    const tbody = document.getElementById('results-body');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const ascending = tbody.getAttribute('data-sort') !== 'asc';
    
    rows.sort((a, b) => {
        const compA = parseFloat(a.getAttribute('data-compensation'));
        const compB = parseFloat(b.getAttribute('data-compensation'));
        return ascending ? compA - compB : compB - compA;
    });
    
    tbody.setAttribute('data-sort', ascending ? 'asc' : 'desc');
    
    allRows = rows;
    filterDrivers();
}

function createCompensationChart() {
    const ctx = document.getElementById('compensationChart').getContext('2d');
    
    const compensations = allRows.map(row => 
        parseFloat(row.getAttribute('data-compensation'))
    );
    
    const ranges = ['0-25', '26-50', '51-75', '76-100', '101-125', '126-150', '151+'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    
    compensations.forEach(comp => {
        if (comp <= 25) counts[0]++;
        else if (comp <= 50) counts[1]++;
        else if (comp <= 75) counts[2]++;
        else if (comp <= 100) counts[3]++;
        else if (comp <= 125) counts[4]++;
        else if (comp <= 150) counts[5]++;
        else counts[6]++;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ranges,
            datasets: [{
                label: 'Number of Drivers',
                data: counts,
                backgroundColor: '#3498db',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Driver Compensation Distribution'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Drivers'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Compensation Range (₱)'
                    }
                }
            }
        }
    });
}