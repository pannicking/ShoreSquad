// ShoreSquad Main Application JavaScript

const WEATHER_API_KEY = 'b8d5de9d2efd6b8c316607ef808a13dc';
const CLEANUP_LOCATION = {
    lat: 1.381497,
    lng: 103.955574
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    fetchWeatherData();
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

// Fetch and display weather data for cleanup location
async function fetchWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${CLEANUP_LOCATION.lat}&lon=${CLEANUP_LOCATION.lng}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await response.json();
        
        if (data.cod === 200) {
            const weatherWidget = document.getElementById('weather-widget');
            const weatherHTML = `
                <div class="weather-info">
                    <h3>Pasir Ris Beach Weather</h3>
                    <div class="weather-details">
                        <p class="temperature">${Math.round(data.main.temp)}°C</p>
                        <p class="description">${data.weather[0].description}</p>
                        <div class="additional-info">
                            <p>Humidity: ${data.main.humidity}%</p>
                            <p>Wind: ${data.wind.speed} m/s</p>
                        </div>
                    </div>
                </div>
            `;
            weatherWidget.innerHTML = weatherHTML;
        } else {
            throw new Error('Weather data not available');
        }
    } catch (error) {
        handleApiError(error);
        const weatherWidget = document.getElementById('weather-widget');
        weatherWidget.innerHTML = '<p class="error">Weather information temporarily unavailable</p>';
    }
}

// Utility function for handling API errors
function handleApiError(error) {
    console.error('API Error:', error);
    // TODO: Implement user-friendly error handling
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
