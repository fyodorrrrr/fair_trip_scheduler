document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    const chartDataElement = document.getElementById('distribution-data');
    if (!chartDataElement) return;
    
    const chartData = JSON.parse(chartDataElement.textContent);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.ranges,
            datasets: [{
                label: 'Driver Count',
                data: chartData.counts,
                backgroundColor: '#3498db',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Compensation Distribution'
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
                        text: 'Compensation Ranges (₱)'
                    }
                }
            }
        }
    });
});