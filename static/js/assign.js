document.addEventListener('DOMContentLoaded', function() {
    // Add dynamic preview of compensation value
    document.getElementById('compensation').addEventListener('input', function() {
        const value = parseFloat(this.value);
        const preview = document.getElementById('compensation-preview');
        
        if (value && value > 0) {
            const driverComp = parseFloat(document.getElementById('driver-compensation').dataset.value);
            const newTotal = driverComp + value;
            // No need to add ₱ symbol here as we're already showing the currency in the label
            preview.innerHTML = `New total: <strong>${newTotal.toFixed(2)}</strong>`;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
    
    // Highlight selected trip type
    document.getElementById('trip_type').addEventListener('change', function() {
        const tripBadges = document.querySelectorAll('.trip-badge');
        tripBadges.forEach(badge => badge.classList.remove('active'));
        
        const selected = this.value;
        document.querySelector(`.trip-badge.${selected}`).classList.add('active');
    });
    
    // Initialize with default values
    document.querySelector('.trip-badge.standard').classList.add('active');
    
    // Initialize Chart.js visualization
    initializeDriverChart();
    
    // Form validation
    document.getElementById('assignment-form').addEventListener('submit', function(event) {
        const location = document.getElementById('location').value.trim();
        const compensation = parseFloat(document.getElementById('compensation').value);
        
        if (!location) {
            showError('Please enter a valid location');
            event.preventDefault();
            return false;
        }
        
        if (!compensation) {
            showError('Please enter a compensation amount');
            event.preventDefault();
            return false;
        }
        
        // Add specific range validation
        if (compensation < 0 || compensation > 1000) { // Adjust this range based on your backend requirements
            showError('Compensation must be between 0 and 1000');
            event.preventDefault();
            return false;
        }
        
        // Show loading indicator
        document.body.classList.add('loading');
        return true;
    });
    
    function showError(message) {
        // Check if error message div exists, if not create it
        let errorDiv = document.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            const formActions = document.querySelector('.form-actions');
            formActions.parentNode.insertBefore(errorDiv, formActions);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Check if error parameter exists in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
        showError(decodeURIComponent(error));
    }
});

function initializeDriverChart() {
    const ctx = document.getElementById('compensationChart').getContext('2d');
    
    // Get chart data from the hidden JSON element
    const chartDataElement = document.getElementById('chart-data');
    if (!chartDataElement) return;
    
    const chartData = JSON.parse(chartDataElement.textContent);
    
    // Create the chart with driver compensation comparison
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Compensation',
                data: chartData.values,
                backgroundColor: chartData.colors,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                borderRadius: 4,
                maxBarThickness: 60
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Compensation: ' + context.parsed.y.toFixed(2);
                            // Removed redundant ₱ symbol
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Compensation'
                        // Removed "(₱)" since values are already in peso
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                            // Removed redundant ₱ symbol conversion
                        }
                    }
                }
            }
        }
    });
}

// Add this function after initializeDriverChart()
function handleBackendError(error) {
    if (error.includes("Compensation out of range")) {
        showError('Compensation value is out of the allowed range');
    } else {
        showError('An error occurred: ' + error);
    }
}