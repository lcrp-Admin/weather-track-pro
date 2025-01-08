const API_KEY = '7b667e8ac19abd6752180a176b6cb401';
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const saveSettings = document.getElementById('save-settings');
const tempUnitSelect = document.getElementById('temp-unit');
const windUnitSelect = document.getElementById('wind-unit');
let weatherUpdateInterval;

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
        
        if (weatherUpdateInterval) {
            clearInterval(weatherUpdateInterval);
        }
        
        weatherUpdateInterval = setInterval(() => {
            getWeather();
        }, 5 * 60 * 1000);

    } catch (error) {
        alert('Error fetching weather data!');
    }
}

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

    updateTimestamp();
}

function updateTimestamp() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    document.getElementById('timestamp').textContent = `Last Updated: ${formattedHours}:${formattedMinutes} ${ampm}`;
}

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

// Event Listeners
searchBtn.addEventListener('click', getWeather);
locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});

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
    
    localStorage.setItem('tempUnit', userPreferences.tempUnit);
    localStorage.setItem('windUnit', userPreferences.windUnit);
    
    if (locationInput.value) {
        getWeather();
    }
    
    modal.style.display = 'none';
});

// Initialize settings and default city
tempUnitSelect.value = userPreferences.tempUnit;
windUnitSelect.value = userPreferences.windUnit;

window.onload = () => {
    locationInput.value = 'Pell City';
    getWeather();
};