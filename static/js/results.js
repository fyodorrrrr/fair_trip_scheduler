const PAGE_SIZE = 10;
let currentPage = 1;
let filteredRows = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize pagination
    setupPagination();
    
    // Initialize chart
    initCompensationChart();
});

// Setup pagination for the table
function setupPagination() {
    const tableBody = document.getElementById('results-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    filteredRows = rows;
    
    // Show initial page
    updatePagination();
    showPage(1);
    
    // Add event listeners for search and filter
    document.getElementById('driver-search').addEventListener('input', function() {
        searchDrivers(this.value);
    });
}

// Update pagination controls
function updatePagination() {
    const paginationEl = document.getElementById('pagination');
    paginationEl.innerHTML = '';
    
    const pageCount = Math.ceil(filteredRows.length / PAGE_SIZE);
    
    // Previous button
    if (pageCount > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn prev-btn';
        prevBtn.innerHTML = '&laquo; Prev';
        prevBtn.disabled = currentPage === 1;
        if (currentPage !== 1) {
            prevBtn.addEventListener('click', () => showPage(currentPage - 1));
        }
        paginationEl.appendChild(prevBtn);
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(pageCount, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => showPage(i));
        paginationEl.appendChild(pageBtn);
    }
    
    // Next button
    if (pageCount > 1) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn next-btn';
        nextBtn.innerHTML = 'Next &raquo;';
        nextBtn.disabled = currentPage === pageCount;
        if (currentPage !== pageCount) {
            nextBtn.addEventListener('click', () => showPage(currentPage + 1));
        }
        paginationEl.appendChild(nextBtn);
    }
    
    // Page info
    if (pageCount > 0) {
        const pageInfo = document.createElement('span');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Page ${currentPage} of ${pageCount}`;
        paginationEl.appendChild(pageInfo);
    }
}

// Show a specific page
function showPage(pageNum) {
    const tableBody = document.getElementById('results-body');
    
    // Hide all rows
    filteredRows.forEach(row => {
        row.style.display = 'none';
    });
    
    // Show rows for current page
    const startIdx = (pageNum - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, filteredRows.length);
    
    for (let i = startIdx; i < endIdx; i++) {
        if (filteredRows[i]) {
            filteredRows[i].style.display = '';
        }
    }
    
    currentPage = pageNum;
    updatePagination();
}

// Search function
function searchDrivers(searchTerm) {
    const tableBody = document.getElementById('results-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    const normalizedSearch = searchTerm.toLowerCase().trim();
    
    if (!normalizedSearch) {
        // If search is empty, apply only filter
        filterDrivers();
        return;
    }
    
    // Filter rows based on search term
    filteredRows = rows.filter(row => {
        const driverName = row.querySelector('th').textContent.toLowerCase();
        const tripText = row.querySelector('td').textContent.toLowerCase();
        return driverName.includes(normalizedSearch) || tripText.includes(normalizedSearch);
    });
    
    // Apply any active filter
    const filterValue = document.getElementById('earnings-filter').value;
    if (filterValue !== 'all') {
        applyEarningsFilter(filterValue);
    }
    
    // Update pagination and show first page
    currentPage = 1;
    updatePagination();
    showPage(1);
    
    // Show no results message if needed
    if (filteredRows.length === 0) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

// Filter function
function filterDrivers() {
    const filterValue = document.getElementById('earnings-filter').value;
    const searchTerm = document.getElementById('driver-search').value.trim();
    
    // First, apply search if any
    if (searchTerm) {
        searchDrivers(searchTerm);
        return;
    }
    
    // Reset to all rows if no search
    const tableBody = document.getElementById('results-body');
    filteredRows = Array.from(tableBody.querySelectorAll('tr'));
    
    // Then apply filter
    if (filterValue !== 'all') {
        applyEarningsFilter(filterValue);
    }
    
    // Update pagination and show first page
    currentPage = 1;
    updatePagination();
    showPage(1);
    
    // Show no results message if needed
    if (filteredRows.length === 0) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

function applyEarningsFilter(filterValue) {
    const appData = document.getElementById('app-data');
    const maxComp = parseFloat(appData.dataset.maxComp);
    const minComp = parseFloat(appData.dataset.minComp);
    const range = maxComp - minComp;
    
    filteredRows = filteredRows.filter(row => {
        const comp = parseFloat(row.dataset.compensation);
        
        switch (filterValue) {
            case 'high':
                return comp >= (minComp + range * 0.7);
            case 'low': 
                return comp <= (minComp + range * 0.3);
            case 'medium':
                return comp > (minComp + range * 0.3) && comp < (minComp + range * 0.7);
            default:
                return true;
        }
    });
}

// Sort by compensation
function sortByCompensation() {
    const tableBody = document.getElementById('results-body');
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    // Toggle sort direction
    const sortAsc = tableBody.dataset.sortDir !== 'asc';
    tableBody.dataset.sortDir = sortAsc ? 'asc' : 'desc';
    
    // Sort rows
    rows.sort((a, b) => {
        const compA = parseFloat(a.dataset.compensation);
        const compB = parseFloat(b.dataset.compensation);
        return sortAsc ? compA - compB : compB - compA;
    });
    
    // Update DOM
    rows.forEach(row => tableBody.appendChild(row));
    
    // Update filtered rows and pagination
    filteredRows = Array.from(tableBody.querySelectorAll('tr'));
    const filterValue = document.getElementById('earnings-filter').value;
    if (filterValue !== 'all') {
        applyEarningsFilter(filterValue);
    }
    
    updatePagination();
    showPage(1);
}

// Handle no results
function showNoResultsMessage() {
    let noResults = document.getElementById('no-results');
    if (!noResults) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'no-results';
        noResults.textContent = 'No matching drivers found.';
        document.querySelector('.table-container').appendChild(noResults);
    }
}

function hideNoResultsMessage() {
    const noResults = document.getElementById('no-results');
    if (noResults) {
        noResults.remove();
    }
}

// Initialize compensation chart
function initCompensationChart() {
    const ctx = document.getElementById('compensationChart').getContext('2d');
    
    // Get all driver data
    const tableRows = document.querySelectorAll('#results-body tr');
    const drivers = [];
    const compensations = [];
    const colors = [];
    
    // Extract data from table
    tableRows.forEach(row => {
        const driverName = row.querySelector('th').textContent;
        const compensation = parseFloat(row.dataset.compensation);
        
        drivers.push(driverName);
        compensations.push(compensation);
        
        // Define color based on compensation ranking
        if (row.classList.contains('top-earner')) {
            colors.push('#27ae60'); // Green for top earners
        } else if (row.classList.contains('low-earner')) {
            colors.push('#e74c3c'); // Red for low earners
        } else {
            colors.push('#3498db'); // Blue for everyone else
        }
    });
    
    // Calculate statistics for annotation lines
    const avgComp = compensations.reduce((a, b) => a + b, 0) / compensations.length;
    
    // Check if dark mode is active
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const textColor = isDarkTheme ? '#e6e6e6' : '#333333';
    const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Create chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: drivers,
            datasets: [{
                label: 'Driver Compensation',
                data: compensations,
                backgroundColor: colors,
                borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                delay: function(context) {
                    return context.dataIndex * 20;
                },
                duration: 1000,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'Inter', sans-serif"
                        },
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    },
                    title: {
                        display: true,
                        text: 'Compensation',
                        color: textColor,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 14,
                            weight: 500
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            family: "'Inter', sans-serif"
                        },
                        autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    title: {
                        display: true,
                        text: 'Drivers',
                        color: textColor,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 14,
                            weight: 500
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDarkTheme ? '#16213e' : '#ffffff',
                    titleColor: isDarkTheme ? '#e6e6e6' : '#212529',
                    bodyColor: isDarkTheme ? '#e6e6e6' : '#212529',
                    borderColor: isDarkTheme ? '#444444' : '#e9ecef',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    boxPadding: 6,
                    titleFont: {
                        family: "'Inter', sans-serif",
                        weight: 600
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            return 'Compensation: ' + context.parsed.y.toFixed(2);
                        }
                    }
                },
                annotation: {
                    annotations: {
                        averageLine: {
                            type: 'line',
                            yMin: avgComp,
                            yMax: avgComp,
                            borderColor: '#4cc9f0',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: '← Average: ₱' + avgComp.toFixed(2),
                                position: 'end',
                                backgroundColor: 'rgba(76, 201, 240, 0.8)',
                                color: 'white',
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 12
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Update chart on theme change
    window.addEventListener('themeChanged', function() {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        // Update chart colors
        chart.options.scales.y.ticks.color = isDarkTheme ? '#e6e6e6' : '#333333';
        chart.options.scales.x.ticks.color = isDarkTheme ? '#e6e6e6' : '#333333';
        chart.options.scales.y.title.color = isDarkTheme ? '#e6e6e6' : '#333333';
        chart.options.scales.x.title.color = isDarkTheme ? '#e6e6e6' : '#333333';
        chart.options.scales.y.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chart.options.scales.x.grid.color = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Update tooltip colors
        chart.options.plugins.tooltip.backgroundColor = isDarkTheme ? '#16213e' : '#ffffff';
        chart.options.plugins.tooltip.titleColor = isDarkTheme ? '#e6e6e6' : '#212529';
        chart.options.plugins.tooltip.bodyColor = isDarkTheme ? '#e6e6e6' : '#212529';
        chart.options.plugins.tooltip.borderColor = isDarkTheme ? '#444444' : '#e9ecef';
        
        chart.update();
    });
    
    // Make chart responsive to container resizing
    new ResizeObserver(entries => {
        chart.resize();
    }).observe(document.querySelector('.chart-container'));
}