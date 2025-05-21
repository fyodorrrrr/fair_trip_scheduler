document.addEventListener('DOMContentLoaded', function() {
    // Get the chart context
    const ctx = document.getElementById('compensationChart').getContext('2d');
    
    // Get data from a hidden element where we'll pass data from Flask
    const chartDataElement = document.getElementById('chart-data');
    if (!chartDataElement) return;
    
    const chartData = JSON.parse(chartDataElement.textContent);
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Driver Compensation',
                data: chartData.values,
                backgroundColor: chartData.colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Compensation Distribution'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '₱' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Compensation (₱)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₱' + value;
                        }
                    }
                }
            }
        }
    });
});