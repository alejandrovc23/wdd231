// OpenWeatherMap API configuration
// IMPORTANT: Replace 'YOUR_OPENWEATHERMAP_API_KEY' with your actual API key from https://openweathermap.org/api
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const LAT = -12.0464; // Lima, Peru latitude
const LON = -77.0428; // Lima, Peru longitude
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`;

// Weather functions
async function getWeather() {
    try {
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(WEATHER_URL),
            fetch(FORECAST_URL)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather API request failed');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-info').innerHTML = `
            <p>Unable to load weather data. Please check your internet connection.</p>
        `;
    }
}

function displayWeather(current, forecast) {
    const weatherContainer = document.getElementById('weather-info');

    // Current weather
    const currentTemp = Math.round(current.main.temp);
    const currentDesc = current.weather[0].description;
    const currentIcon = current.weather[0].icon;

    // 3-day forecast (taking every 8th item for daily forecast)
    const dailyForecasts = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 3);

    weatherContainer.innerHTML = `
        <div class="current-weather">
            <h3>Current Conditions</h3>
            <div class="weather-main">
                <img src="https://openweathermap.org/img/wn/${currentIcon}@2x.png" alt="${currentDesc}">
                <div class="weather-details">
                    <p class="temperature">${currentTemp}°C</p>
                    <p class="description">${currentDesc.charAt(0).toUpperCase() + currentDesc.slice(1)}</p>
                </div>
            </div>
        </div>
        <div class="forecast">
            <h3>3-Day Forecast</h3>
            <div class="forecast-cards">
                ${dailyForecasts.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;
        return `
                        <div class="forecast-card">
                            <p class="day">${dayName}</p>
                            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].description}">
                            <p class="temp">${temp}°C</p>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
}

// Spotlight functions
async function getSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();

        // Filter for gold and silver members (membership levels 2 and 3)
        const eligibleMembers = members.filter(member => member.membership >= 2);

        // Randomly select 2-3 members
        const numSpotlights = Math.min(3, eligibleMembers.length);
        const selectedMembers = [];

        for (let i = 0; i < numSpotlights; i++) {
            const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
            selectedMembers.push(eligibleMembers.splice(randomIndex, 1)[0]);
        }

        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Error loading member data:', error);
        document.getElementById('spotlight-cards').innerHTML = `
            <p>Unable to load member spotlights.</p>
        `;
    }
}

function displaySpotlights(members) {
    const spotlightContainer = document.getElementById('spotlight-cards');

    spotlightContainer.innerHTML = members.map(member => {
        const membershipText = member.membership === 2 ? 'Silver' : 'Gold';
        const membershipClass = member.membership === 2 ? 'silver-level' : 'gold-level';

        return `
            <div class="spotlight-card ${membershipClass}">
                <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
                <div class="spotlight-content">
                    <h3>${member.name}</h3>
                    <p class="membership">Membership: ${membershipText}</p>
                    <p class="address">${member.address}</p>
                    <p class="phone">${member.phone}</p>
                    <a href="${member.website}" target="_blank" class="website-link">Visit Website</a>
                    <p class="description">${member.description}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Initialize page functions
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    getSpotlights();
    initializeAnimations();
    initializeNewsletter();
});

// Animation functions
function initializeAnimations() {
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all major sections
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Newsletter functionality
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;

            // Simple validation
            if (email && email.includes('@')) {
                // Show success message
                showNotification('Thank you for subscribing! We\'ll keep you updated with the latest news.', 'success');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        fontWeight: '500',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease-out'
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Add slide out animation
    style.textContent += `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
}