// Initialize chart with custom styling
const ctx = document.getElementById('weatherChart').getContext('2d');
Chart.defaults.color = 'rgba(203, 213, 225, 0.7)';
Chart.defaults.font.family = "'Inter', sans-serif";

const weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperature (°C)',
                borderColor: 'rgb(244, 63, 94)',
                backgroundColor: 'rgba(244, 63, 94, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(244, 63, 94)',
                pointBorderColor: '#2e325a',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                data: [],
                yAxisID: 'y'
            },
            {
                label: 'Humidity (%)',
                borderColor: 'rgb(6, 182, 212)',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(6, 182, 212)',
                pointBorderColor: '#2e325a',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                data: [],
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'rectRounded',
                    boxWidth: 10,
                    boxHeight: 10,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(46, 50, 90, 0.9)',
                titleFont: {
                    size: 13
                },
                bodyFont: {
                    size: 13
                },
                padding: 10,
                cornerRadius: 8,
                displayColors: true,
                borderColor: 'rgba(76, 79, 122, 1)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(76, 79, 122, 0.2)',
                    borderColor: 'rgba(76, 79, 122, 0.5)'
                },
                ticks: {
                    font: {
                        size: 11
                    }
                },
                title: {
                    display: true,
                    text: 'Time',
                    font: {
                        size: 13
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    font: {
                        size: 13
                    },
                    color: 'rgb(244, 63, 94)'
                },
                grid: {
                    color: 'rgba(76, 79, 122, 0.2)',
                    borderColor: 'rgba(76, 79, 122, 0.5)'
                },
                min: 0,
                max: 50,
                ticks: {
                    color: 'rgba(244, 63, 94, 0.8)'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Humidity (%)',
                    font: {
                        size: 13
                    },
                    color: 'rgb(6, 182, 212)'
                },
                min: 0,
                max: 100,
                grid: {
                    drawOnChartArea: false,
                    borderColor: 'rgba(76, 79, 122, 0.5)'
                },
                ticks: {
                    color: 'rgba(6, 182, 212, 0.8)'
                }
            }
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear'
            }
        }
    }
});

// Check for most recent data immediately
function fetchCurrentReadings() {
    axios.get('/api/weather/current')
        .then(response => {
            const data = response.data;
            if (data) {
                if (data.temperature !== undefined) {
                    document.getElementById("temp").innerText = data.temperature.toFixed(1);
                }
                if (data.humidity !== undefined) {
                    document.getElementById("humidity").innerText = data.humidity.toFixed(1);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching current readings:', error);
        });
}

// Function to update the chart with 5-minute interval data
function updateChartWithHistoricalData() {
    axios.get('/api/weather/history')
        .then(response => {
            const data = response.data;
            
            if (data.length > 0) {
                document.getElementById("db-status").textContent = "Connected, storing data";
                document.getElementById("db-status").style.color = "var(--success-color)";
                document.getElementById("db-pulse").classList.remove("error");
            }
            
            // Clear existing data
            weatherChart.data.labels = [];
            weatherChart.data.datasets[0].data = [];
            weatherChart.data.datasets[1].data = [];
            
            // Add historical data points
            data.forEach(point => {
                const timestamp = new Date(point.timestamp).toLocaleTimeString();
                weatherChart.data.labels.push(timestamp);
                weatherChart.data.datasets[0].data.push(point.avg_temperature);
                weatherChart.data.datasets[1].data.push(point.avg_humidity);
            });
            
            // Update average displays
            if (data.length > 0) {
                const latest = data[data.length - 1];
                document.getElementById("avg-temp").innerText = latest.avg_temperature !== null ? latest.avg_temperature.toFixed(1) : "--";
                document.getElementById("avg-humidity").innerText = latest.avg_humidity !== null ? latest.avg_humidity.toFixed(1) : "--";
                document.getElementById("last-update").innerText = new Date().toLocaleTimeString();
            }
            
            weatherChart.update();
        })
        .catch(error => {
            console.error('Error fetching historical data:', error);
            document.getElementById("db-status").textContent = "Error connecting to database";
            document.getElementById("db-status").style.color = "var(--error-color)";
            document.getElementById("db-pulse").classList.add("error");
        });
}

// Connect to the MQTT Broker over WebSockets
const mqttClient = mqtt.connect('ws://157.173.101.159:9001');

mqttClient.on('connect', () => {
    console.log("Connected to MQTT via WebSockets");
    mqttClient.subscribe("/work_group_01/room_temp/temperature");
    mqttClient.subscribe("/work_group_01/room_temp/humidity");
});

mqttClient.on('message', (topic, message) => {
    console.log(`Received: ${topic} → ${message.toString()}`);
    const value = parseFloat(message.toString());
    
    // Update the display with animation
    if (topic === "/work_group_01/room_temp/temperature") {
        const tempElement = document.getElementById("temp");
        animateValue(tempElement, parseFloat(tempElement.innerText) || 0, value, 1000);
        
        // Send to backend to store in SQLite
        axios.post('/api/weather/data', {
            type: 'temperature',
            value: value,
            timestamp: new Date().toISOString()
        }).catch(error => console.error('Error storing temperature:', error));
        
    } else if (topic === "/work_group_01/room_temp/humidity") {
        const humidityElement = document.getElementById("humidity");
        animateValue(humidityElement, parseFloat(humidityElement.innerText) || 0, value, 1000);
        
        // Send to backend to store in SQLite
        axios.post('/api/weather/data', {
            type: 'humidity',
            value: value,
            timestamp: new Date().toISOString()
        }).catch(error => console.error('Error storing humidity:', error));
    }
});

// Animate value change function
function animateValue(element, start, end, duration) {
    if (isNaN(start)) start = 0;
    if (isNaN(end)) return;
    
    const range = end - start;
    let current = start;
    const increment = end > start ? 0.1 : -0.1;
    const stepTime = Math.abs(Math.floor(duration / (range / increment)));
    
    const timer = setInterval(function() {
        current += increment;
        element.innerText = current.toFixed(1);
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.innerText = end.toFixed(1);
            clearInterval(timer);
        }
    }, stepTime);
}

// Fetch current readings on load
fetchCurrentReadings();

// Update chart with historical data regularly
updateChartWithHistoricalData(); // Initial load
setInterval(updateChartWithHistoricalData, 30000); // Then every 30 seconds