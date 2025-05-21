document.addEventListener('DOMContentLoaded', function() {
    // Get the chart data from the hidden element
    const chartDataElement = document.getElementById('chart-data');
    const chartData = JSON.parse(chartDataElement.textContent);
    
    // Create the chart
    const ctx = document.getElementById('compensationChart').getContext('2d');
    const compensationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Driver Compensation',
                data: chartData.data,
                backgroundColor: chartData.colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Compensation ($)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Drivers'
                    }
                }
            }
        }
    });
});