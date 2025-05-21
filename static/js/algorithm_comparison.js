document.addEventListener('DOMContentLoaded', function() {
    // Get the chart data from the hidden element that contains the JSON
    const chartDataElement = document.getElementById('chart-data');
    const chartData = JSON.parse(chartDataElement.textContent);
    
    // Create the chart
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    const comparisonChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value ($)'
                    }
                }
            }
        }
    });
});