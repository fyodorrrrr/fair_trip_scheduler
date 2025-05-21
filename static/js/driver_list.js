let currentPage = 1;
let driversPerPage = 10;
let allDrivers = [];
let filteredDrivers = [];
let currentView = 'list'; // 'list' or 'grid'

function getAllRows() {
    return Array.from(document.querySelectorAll('#drivers-table tbody tr'));
}

document.addEventListener('DOMContentLoaded', function() {
    allDrivers = getAllRows();
    filteredDrivers = allDrivers.slice();
    displayDrivers();

    // Set up mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Load saved view preference
    const savedView = localStorage.getItem('view') || 'list';
    switchView(savedView);
});

function displayDrivers() {
    if (currentView === 'list') {
        displayListView();
    } else {
        displayGridView();
    }
}

function displayListView() {
    const tbody = document.querySelector('#drivers-table tbody');
    tbody.innerHTML = '';
    const startIndex = (currentPage - 1) * driversPerPage;
    const endIndex = startIndex + driversPerPage;
    const displayed = filteredDrivers.slice(startIndex, endIndex);
    displayed.forEach(row => tbody.appendChild(row));
    updatePagination();
}

function displayGridView() {
    const grid = document.getElementById('drivers-grid');
    
    // Clear the current grid
    grid.innerHTML = '';
    
    // Get data from the table rows
    const startIndex = (currentPage - 1) * driversPerPage;
    const endIndex = startIndex + driversPerPage;
    const displayedRows = filteredDrivers.slice(startIndex, endIndex);
    
    // Create cards for each driver
    displayedRows.forEach((row, index) => {
        const driverName = row.cells[0].textContent;
        const driverCompensation = row.cells[1].textContent;
        
        // Create a new card
        const card = document.createElement('div');
        card.className = 'driver-card';
        
        // Get the trip count (assuming trips are stored somewhere)
        const tripCount = Math.floor(Math.random() * 10); // Replace with actual data if available
        
        card.innerHTML = `
            <div class="driver-card-header">
                <h3 class="driver-name">${driverName}</h3>
                <span class="driver-rank">#${startIndex + index + 1}</span>
            </div>
            <div class="driver-card-body">
                <div class="driver-compensation">${driverCompensation}</div>
                <div class="driver-trips">
                    Trips: <span class="trip-count">${tripCount}</span>
                </div>
            </div>
            <div class="driver-card-footer">
                <a href="/assign/${driverName}" class="btn">Assign Trip</a>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / driversPerPage));
    document.getElementById('current-page').textContent = `Page ${currentPage} of ${totalPages}`;
}

function switchView(view) {
    currentView = view;
    localStorage.setItem('view', view);
    
    const listView = document.getElementById('list-view');
    const gridView = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    
    if (view === 'list') {
        listView.style.display = 'block';
        gridView.style.display = 'none';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    } else {
        listView.style.display = 'none';
        gridView.style.display = 'block';
        listViewBtn.classList.remove('active');
        gridViewBtn.classList.add('active');
    }
    
    displayDrivers();
}

function nextPage() {
    const totalPages = Math.max(1, Math.ceil(filteredDrivers.length / driversPerPage));
    if (currentPage < totalPages) {
        currentPage++;
        displayDrivers();
        
        // Show loading animation
        showLoader();
        setTimeout(hideLoader, 300); // Simulate loading
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayDrivers();
        
        // Show loading animation
        showLoader();
        setTimeout(hideLoader, 300); // Simulate loading
    }
}

function changePerPage(value) {
    driversPerPage = parseInt(value);
    currentPage = 1;
    displayDrivers();
    
    // Show loading animation
    showLoader();
    setTimeout(hideLoader, 500); // Simulate loading
}

function searchDrivers() {
    const searchTerm = document.getElementById('driver-search').value.toLowerCase();
    
    // Show loading animation
    showLoader();
    
    setTimeout(() => {
        filteredDrivers = allDrivers.filter(row => {
            const driverName = row.cells[0].textContent.toLowerCase();
            return driverName.includes(searchTerm);
        });
        currentPage = 1;
        displayDrivers();
        hideLoader();
    }, 500); // Simulate loading delay
}

function filterDrivers() {
    const filterValue = document.getElementById('comp-filter').value;
    
    // Show loading animation
    showLoader();
    
    setTimeout(() => {
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
        hideLoader();
    }, 500); // Simulate loading delay
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('active');
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('active');
    }
}

// Export functionality
document.getElementById('export-png').addEventListener('click', function() {
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'driver-compensation-chart.png';
    link.href = compensationChart.toBase64Image();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show confirmation toast
    showToast('Chart image saved successfully!');
});

document.getElementById('export-csv').addEventListener('click', function() {
    let csvContent = 'Driver,Compensation\n';
    
    chartData.labels.forEach((driver, i) => {
        csvContent += `${driver},${chartData.data[i]}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'driver-compensation-data.csv';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Show confirmation toast
    showToast('CSV data exported successfully!');
});

// Toast message function
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Show message
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}