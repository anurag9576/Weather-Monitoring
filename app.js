const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const weatherTableBody = document.querySelector('#weatherTable tbody');
const alertsBox = document.getElementById('alertsBox');

const alertThreshold = 35;  
const weatherData = {};

function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(2);
}

function formatTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleString();
}

function fetchWeatherData(city) {
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=fd5cea4ec4c7d8d28c2913e91ca99d8a`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tempCelsius = kelvinToCelsius(data.main.temp);
            const feelsLikeCelsius = kelvinToCelsius(data.main.feels_like);
            const timestamp = data.dt;

             
            weatherData[city] = weatherData[city] || [];
            weatherData[city].push({ tempCelsius, timestamp });

            
            addWeatherDataToTable(city, data.weather[0].main, tempCelsius, feelsLikeCelsius, timestamp);
            checkAlertConditions(city, tempCelsius);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function addWeatherDataToTable(city, main, temp, feelsLike, timestamp) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${city}</td>
        <td>${main}</td>
        <td>${temp}</td>
        <td>${feelsLike}</td>
        <td>${formatTime(timestamp)}</td>
    `;
    weatherTableBody.appendChild(row);
}

function checkAlertConditions(city, temperature) {
     
    if (temperature > alertThreshold) {
        const alertMessage = `${city}: Temperature exceeded ${alertThreshold}°C`;
        addAlert(alertMessage);
    }
}

function addAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert');
    alertDiv.innerText = message;
    alertsBox.appendChild(alertDiv);
}

 
setInterval(() => {
    cities.forEach(city => fetchWeatherData(city));
}, 300000); // 300000 ms = 5 minutes

// Fetch weather data initially on page load
cities.forEach(city => fetchWeatherData(city));
