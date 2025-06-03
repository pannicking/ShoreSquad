// ShoreSquad Main Application JavaScript

const CLEANUP_LOCATION = {
    lat: 1.381497,
    lng: 103.955574,
    name: 'Pasir Ris'
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    fetchSGWeatherData();
});

function initializeApp() {
    // Add smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize animation observers
    initializeAnimations();
}

// Initialize Intersection Observer for scroll animations
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Placeholder for map initialization
async function initializeMap() {
    // TODO: Implement map functionality using a mapping service
    console.log('Map initialization pending...');
}

// Fetch and display weather data from data.gov.sg
async function fetchSGWeatherData() {
    const weatherWidget = document.getElementById('weather-widget');
    weatherWidget.innerHTML = '<p>Loading weather information...</p>';

    try {
        // Fetch 4-day forecast
        const response = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast');
        if (!response.ok) {
            throw new Error(`Weather API returned ${response.status}`);
        }
        const data = await response.json();

        // Check if we have data
        if (!data.items || data.items.length === 0) {
            throw new Error('No weather data available');
        }

        const forecasts = data.items[0].forecasts;        let forecastHTML = `
            <div class="weather-info">
                <h3>${CLEANUP_LOCATION.name} Beach Weather</h3>
                <div class="forecast-container">`;

        // Add forecast for each day
        forecasts.forEach(day => {
            const date = new Date(day.date);
            const dateStr = date.toLocaleDateString('en-SG', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            });

            // Set default values for missing data
            const temperature = day.temperature || { low: 'N/A', high: 'N/A' };
            const humidity = day.relative_humidity || { low: 'N/A', high: 'N/A' };
            const forecast = day.forecast || 'No forecast available';
            const wind = day.wind || { speed: { low: 'N/A', high: 'N/A' }, direction: 'N/A' };

            forecastHTML += `
                <div class="forecast-day ${date.toLocaleDateString() === new Date().toLocaleDateString() ? 'current-day' : ''}">
                    <h4>${dateStr}</h4>
                    <div class="forecast-icon">
                        ${getForecastIcon(forecast)}
                    </div>
                    <p class="forecast-temp">
                        <span class="temp-high">${temperature.high}°C</span>
                        <span class="temp-low">${temperature.low}°C</span>
                    </p>
                    <p class="forecast-desc">${forecast}</p>
                    <p class="forecast-humidity">Humidity: ${humidity.low}% - ${humidity.high}%</p>
                    <p class="forecast-wind">Wind: ${wind.speed.low}-${wind.speed.high} km/h ${wind.direction}</p>
                </div>`;
        });

        forecastHTML += `
                </div>
                <div class="weather-updated">
                    <small>Last updated: ${new Date().toLocaleString('en-SG')}</small>
                </div>
            </div>`;

        weatherWidget.innerHTML = forecastHTML;

    } catch (error) {
        console.error('Weather API Error:', error);
        weatherWidget.innerHTML = `
            <div class="weather-error">
                <p class="error">Weather information temporarily unavailable</p>
                <p class="error-details">${error.message}</p>
                <button onclick="fetchSGWeatherData()" class="retry-button">Retry</button>
            </div>`;
    }
}

// Helper function to get weather icon based on forecast
function getForecastIcon(forecast) {
    const lowerForecast = forecast.toLowerCase();
    if (lowerForecast.includes('thundery') || lowerForecast.includes('thunder')) {
        return '⛈️';
    } else if (lowerForecast.includes('rain') || lowerForecast.includes('showers')) {
        return '🌧️';
    } else if (lowerForecast.includes('cloudy')) {
        return '☁️';
    } else if (lowerForecast.includes('fair')) {
        return '🌤️';
    } else if (lowerForecast.includes('sunny')) {
        return '☀️';
    } else if (lowerForecast.includes('windy')) {
        return '💨';
    } else {
        return '🌥️'; // default partly cloudy icon
    }
}

// Performance optimization: Debounce function for performance-heavy operations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
