// ==============================
// Portfolio Script: indexScripts.js
// ==============================
//
// This script handles:
// 1. ScrollReveal animations for different sections
// 2. Geolocation-based weather fetch using OpenWeatherMap API
// 3. Fallback ZIP code-based weather search
// 4. Enter-key submission for ZIP input
//
// Author: Cole Coombs
// ==============================


// ---- SCROLL ANIMATIONS ---- //
console.log(import.meta.env.VITE_WEATHER_API_KEY);

ScrollReveal().reveal('#hero', {
  duration: 1000,
  origin: 'top',
  distance: '50px'
});

ScrollReveal().reveal('#summary, #education, #certs, #experience, #skills, #projects, #achievements', {
  duration: 800,
  origin: 'bottom',
  distance: '30px',
  interval: 200
});



// Updates the weather display with API data
// Removed API calls to avoid exposing the API key
function displayWeather(data) {
  document.getElementById("city").textContent = data.name;
  document.getElementById("temp").textContent = Math.round(data.main.temp);
  document.getElementById("desc").textContent = data.weather[0].description;
}

// Fetches weather using ZIP code as fallback
function fetchWeatherByZip(zip) {
  document.getElementById("location-status").textContent = `Looking up weather for ${zip}...`;
  fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&units=imperial&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) throw new Error("Invalid ZIP");
      return response.json();
    })
    .then(data => {
      displayWeather(data);
      document.getElementById("location-status").textContent = "Location loaded via ZIP";
    })
    .catch(() => {
      document.getElementById("location-status").textContent = "ZIP code not found.";
    });
}

// Fetches weather using coordinates from geolocation
function fetchWeatherByCoords(lat, lon) {
  document.getElementById("location-status").textContent = "Getting weather by location...";
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
      document.getElementById("location-status").textContent = "Location loaded via browser";
    })
    .catch(() => {
      document.getElementById("location-status").textContent = "Could not fetch weather for location.";
    });
}

// Called by button or Enter key: fetches based on input ZIP
function getWeatherByZip() {
  const zip = document.getElementById("zipInput").value;
  if (zip.length === 5 && /^\d+$/.test(zip)) {
    fetchWeatherByZip(zip);
  } else {
    document.getElementById("location-status").textContent = "Please enter a valid 5-digit ZIP code.";
  }
}

// Triggers location fetch on page load
window.addEventListener("DOMContentLoaded", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        document.getElementById("location-status").textContent = "Location access denied. Enter ZIP code.";
      }
    );
  } else {
    document.getElementById("location-status").textContent = "Geolocation not supported. Enter ZIP code.";
  }
});

// Allows ZIP code form submission with Enter key
document.getElementById("zipInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    getWeatherByZip();
  }
});
