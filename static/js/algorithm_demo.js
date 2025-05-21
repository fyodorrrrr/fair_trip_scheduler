document.addEventListener('DOMContentLoaded', function() {
    // Set up mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Get the chart data from the hidden element
    const chartDataElement = document.getElementById('chart-data');
    if (!chartDataElement) return;
    
    const chartData = JSON.parse(chartDataElement.textContent);
    
    // Show loading animation
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('active');
    
    // Create the chart with a slight delay for animation
    setTimeout(() => {
        const ctx = document.getElementById('compensationChart').getContext('2d');
        
        // Get theme for chart styling
        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        const textColor = isDarkTheme ? '#e6e6e6' : '#495057';
        const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        const compensationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Driver Compensation',
                    data: chartData.data,
                    backgroundColor: chartData.colors,
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
                        // First bar appears immediately, others stagger by 100ms each
                        return context.dataIndex * 100;
                    },
                    duration: 1500,
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
                                return '₱' + value;  // Add peso sign to tick marks
                            }
                        },
                        title: {
                            display: true,
                            text: 'Compensation (₱)',
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
                            color: gridColor,
                            display: false
                        },
                        ticks: {
                            color: textColor,
                            font: {
                                family: "'Inter', sans-serif"
                            }
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
                    annotation: {
                        annotations: {
                            averageLine: {
                                type: 'line',
                                yMin: chartData.averageCompensation || Math.min(...chartData.data) * 1.3,
                                yMax: chartData.averageCompensation || Math.min(...chartData.data) * 1.3,
                                borderColor: '#4cc9f0',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: 'Average',
                                    position: 'end',
                                    backgroundColor: 'rgba(76, 201, 240, 0.8)',
                                    color: 'white'
                                }
                            }
                        }
                    },
                    legend: {
                        labels: {
                            color: textColor,
                            font: {
                                family: "'Inter', sans-serif",
                                size: 13
                            }
                        }
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
                                return 'Compensation: ₱' + context.parsed.y;  // Add peso sign to tooltips
                            }
                        }
                    }
                }
            }
        });
        
        // Hide loader
        if (loader) loader.classList.remove('active');
        
        // Use requestAnimationFrame for smoother animations
        const animateChartEntrance = () => {
            const chartContainer = document.querySelector('.chart-container');
            let opacity = 0;
            
            function animate() {
                opacity += 0.05;
                chartContainer.style.opacity = Math.min(opacity, 1);
                
                if (opacity < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        // Start animation
        animateChartEntrance();
        
        // Improve accessibility
        const chartCanvas = document.getElementById('compensationChart');
        chartCanvas.setAttribute('role', 'img');
        chartCanvas.setAttribute('aria-label', 'Bar chart showing driver compensation distribution');

        // Add keyboard navigation for interactive elements
        document.querySelectorAll('.btn, .nav-link').forEach(el => {
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Update chart on theme change
        document.addEventListener('themeChanged', function(e) {
            const isDarkTheme = e.detail.theme === 'dark';
            const textColor = isDarkTheme ? '#e6e6e6' : '#495057';
            const gridColor = isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            
            // Update chart colors
            compensationChart.options.scales.y.ticks.color = textColor;
            compensationChart.options.scales.y.title.color = textColor;
            compensationChart.options.scales.x.ticks.color = textColor;
            compensationChart.options.scales.x.title.color = textColor;
            compensationChart.options.scales.y.grid.color = gridColor;
            compensationChart.options.scales.x.grid.color = gridColor;
            compensationChart.options.plugins.legend.labels.color = textColor;
            compensationChart.options.plugins.tooltip.backgroundColor = isDarkTheme ? '#16213e' : '#ffffff';
            compensationChart.options.plugins.tooltip.titleColor = isDarkTheme ? '#e6e6e6' : '#212529';
            compensationChart.options.plugins.tooltip.bodyColor = isDarkTheme ? '#e6e6e6' : '#212529';
            compensationChart.options.plugins.tooltip.borderColor = isDarkTheme ? '#444444' : '#e9ecef';
            
            compensationChart.update();
        });

        // Store original colors for resetting
        const originalColors = [...chartData.colors];
        let activeBar = -1;

        // Add click interaction to chart
        chartCanvas.onclick = function(evt) {
            const points = compensationChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
            
            if (points.length) {
                const index = points[0].index;
                
                // Reset previously highlighted bar
                if (activeBar >= 0) {
                    compensationChart.data.datasets[0].backgroundColor[activeBar] = originalColors[activeBar];
                }
                
                // If clicking same bar, just reset, otherwise highlight new bar
                if (activeBar !== index) {
                    activeBar = index;
                    // Highlight the clicked bar
                    compensationChart.data.datasets[0].backgroundColor[index] = '#f72585'; // Highlight color
                    
                    // Create or update driver details panel
                    showDriverDetails(chartData.labels[index], chartData.data[index]);
                } else {
                    activeBar = -1;
                    // Remove details panel if any
                    const detailsPanel = document.getElementById('driver-details-panel');
                    if (detailsPanel) detailsPanel.remove();
                }
                
                compensationChart.update();
            }
        };

        // Function to display driver details
        function showDriverDetails(driverName, compensation) {
            // Remove existing panel if any
            const existingPanel = document.getElementById('driver-details-panel');
            if (existingPanel) existingPanel.remove();
            
            // Create details panel
            const panel = document.createElement('div');
            panel.id = 'driver-details-panel';
            panel.className = 'driver-details-panel';
            panel.innerHTML = `
                <h3>${driverName}</h3>
                <p>Compensation: <strong>₱${compensation}</strong></p>
                <p>Rank: #${chartData.labels.indexOf(driverName) + 1} of ${chartData.labels.length}</p>
                <a href="/assign/${driverName}" class="btn btn-sm">Assign Trip</a>
            `;
            
            // Add to chart container
            document.querySelector('.chart-container').appendChild(panel);
        }

        // Responsive chart optimization
        const updateChartForScreenSize = () => {
            const isMobile = window.innerWidth < 576;
            
            if (isMobile) {
                // On mobile, reduce padding and adjust font sizes
                compensationChart.options.plugins.legend.display = false;
                compensationChart.options.scales.x.ticks.maxRotation = 45;
                compensationChart.options.scales.x.ticks.font.size = 10;
            } else {
                // On desktop, show legend and reset ticks
                compensationChart.options.plugins.legend.display = true;
                compensationChart.options.scales.x.ticks.maxRotation = 0;
                compensationChart.options.scales.x.ticks.font.size = 12;
            }
            
            compensationChart.update();
        };

        // Call on load and window resize
        updateChartForScreenSize();
        window.addEventListener('resize', debounce(updateChartForScreenSize, 250));

        // Debounce helper function
        function debounce(func, wait) {
            let timeout;
            return function() {
                const context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        }
    }, 800);

    // User guidance tooltip
    const helpTooltip = document.getElementById('chart-help');
    const closeHelp = document.getElementById('close-help');

    // Show help tooltip if it's the user's first visit
    const hasSeenHelp = localStorage.getItem('hasSeenChartHelp');
    if (!hasSeenHelp) {
        // Show after a short delay
        setTimeout(() => {
            helpTooltip.classList.add('visible');
        }, 1500);
    }

    // Close tooltip and remember user choice
    if (closeHelp) {
        closeHelp.addEventListener('click', () => {
            helpTooltip.classList.remove('visible');
            localStorage.setItem('hasSeenChartHelp', 'true');
        });
    }
});