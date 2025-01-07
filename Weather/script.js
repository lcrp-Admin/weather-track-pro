const API_KEY = '7b667e8ac19abd6752180a176b6cb401'; // Get from OpenWeatherMap
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', getWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

// Add these at the top of your script.js
const userPreferences = {
    tempUnit: localStorage.getItem('tempUnit') || 'fahrenheit',
    windUnit: localStorage.getItem('windUnit') || 'mph'
};
async function getWeather() {
    const city = locationInput.value;
    if (!city) return;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (data.cod === '404') {
            alert('City not found!');
            return;
        }

        updateWeatherUI(data);
    } catch (error) {
        alert('Error fetching weather data!');
    }
}

// Modify the updateWeatherUI function
function updateWeatherUI(data) {
    const temp = convertTemp(data.main.temp, userPreferences.tempUnit);
    const windSpeed = convertWind(data.wind.speed, userPreferences.windUnit);
    
    document.getElementById('city').textContent = data.name;
    document.getElementById('date').textContent = new Date().toLocaleDateString();
    document.getElementById('temp').textContent = `${Math.round(temp)}°${userPreferences.tempUnit === 'fahrenheit' ? 'F' : 'C'}`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind').textContent = `${windSpeed.toFixed(1)} ${userPreferences.windUnit === 'mph' ? 'mph' : 'km/h'}`;
    document.getElementById('condition').textContent = data.weather[0].main;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Add these conversion functions
function convertTemp(celsius, unit) {
    if (unit === 'fahrenheit') {
        return (celsius * 9/5) + 32;
    }
    return celsius;
}

function convertWind(kph, unit) {
    if (unit === 'mph') {
        return kph * 0.621371;
    }
    return kph;
}

// Initialize with default city
window.onload = () => {
    locationInput.value = 'Pell City';
    getWeather();
};

// Add settings modal functionality
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const saveSettings = document.getElementById('save-settings');
const tempUnitSelect = document.getElementById('temp-unit');
const windUnitSelect = document.getElementById('wind-unit');

// Initialize settings
tempUnitSelect.value = userPreferences.tempUnit;
windUnitSelect.value = userPreferences.windUnit;

settingsBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

saveSettings.addEventListener('click', () => {
    userPreferences.tempUnit = tempUnitSelect.value;
    userPreferences.windUnit = windUnitSelect.value;
    
    // Save to localStorage
    localStorage.setItem('tempUnit', userPreferences.tempUnit);
    localStorage.setItem('windUnit', userPreferences.windUnit);
    
    // Update display
    if (locationInput.value) {
        getWeather();
    }
    
    modal.style.display = 'none';
});
