const API_KEY = '4d8d029937b7d07d57c6a6b38fe2e75d';

// DOM Elements
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const settingsBtn = document.getElementById('settings-btn');
const modal = document.getElementById('settings-modal');
const saveSettings = document.getElementById('save-settings');
const tempUnitSelect = document.getElementById('temp-unit');
const windUnitSelect = document.getElementById('wind-unit');
const snowChanceDisplay = document.getElementById('snow-chance');
const snowAnimation = document.getElementById('snow-animation');

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
    
    // Snow chance calculation
    const snowChance = calculateSnowChance(temp, data.main.humidity, data.clouds.all);
    snowChanceDisplay.textContent = `Snow Chance: ${snowChance}%`;
    createSnowflakes(snowChance);
    updateSnowMessage(snowChance);
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

// Conversion Functions
function convertTemp(celsius, unit) {
    return unit === 'fahrenheit' ? (celsius * 9/5) + 32 : celsius;
}

function convertWind(kph, unit) {
    return unit === 'mph' ? kph * 0.621371 : kph;
}

// Snow-related Functions
function calculateSnowChance(temp, humidity, precipitation) {
    let chance = 0;
    
    if (temp <= 32) {
        chance += 40;
        if (temp >= 20 && temp <= 30) {
            chance += 20;
        }
    } else {
        chance -= (temp - 32) * 2;
    }
    
    if (humidity >= 70) {
        chance += 20;
    } else {
        chance += (humidity / 70) * 20;
    }
    
    chance *= (precipitation / 100);
    return Math.max(0, Math.min(100, Math.round(chance)));
}

function createSnowflakes(chance) {
    snowAnimation.innerHTML = '';
    const numSnowflakes = Math.floor(chance / 5);
    
    for (let i = 0; i < numSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 2 + 1}s`;
        snowflake.style.opacity = Math.random();
        snowAnimation.appendChild(snowflake);
    }
}

function updateSnowMessage(chance) {
    const messages = {
        80: "Get your snow boots ready!",
        60: "Good chance of snow!",
        40: "Snow is possible!",
        20: "Light snow chance",
        0: "Snow is unlikely"
    };
    
    const threshold = Object.keys(messages)
        .sort((a, b) => b - a)
        .find(key => chance >= key);
    
    document.getElementById('snow-message').textContent = messages[threshold];
}

// Event Listeners
searchBtn.addEventListener('click', getWeather);
locationInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') getWeather();
});

settingsBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

window.addEventListener('click', e => {
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

// Initialization
tempUnitSelect.value = userPreferences.tempUnit;
windUnitSelect.value = userPreferences.windUnit;

window.onload = () => {
    locationInput.value = 'Pell City';
    getWeather();
};