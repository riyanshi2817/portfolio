const input = document.querySelector("input");
const getBtn = document.querySelector("button");
const locationBtn = document.querySelector(".location-btn");
const weatherPart = document.querySelector(".weather-part");
const temp = document.querySelector(".temp");
const desc = document.querySelector(".description");
const loc = document.querySelector(".location");
const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");
const icon = document.querySelector(".weather-part i");

const api = "058fcd8fc2a65dbe74cb86086607245a";

getBtn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
});

locationBtn.addEventListener("click", () => {
  alert("Location feature is not supported .");
});

function getWeatherByCity(city) {
  fetch(`http://api.weatherstack.com/current?access_key=${api}&query=${city}`)
    .then(res => res.json())
    .then(data => {
      if (data.success === false || data.error) {
        alert("City not found or API error.");
        return;
      }
      updateUI(data);
    })
    .catch(() => alert("Network error or invalid request."));
}

function updateUI(data) {
  weatherPart.classList.remove("hide");

  temp.textContent = `${data.current.temperature}°C`;
  desc.textContent = data.current.weather_descriptions[0];
  loc.textContent = `${data.location.name}, ${data.location.country}`;
  feelsLike.textContent = `${data.current.feelslike}°C`;
  humidity.textContent = `${data.current.humidity}%`;

  const weatherMain = data.current.weather_descriptions[0];
  const iconMap = {
    "Cloudy": "fa-cloud",
    "Sunny": "fa-sun",
    "Clear": "fa-sun",
    "Rain": "fa-cloud-showers-heavy",
    "Snow": "fa-snowflake",
    "Mist": "fa-smog",
    "Fog": "fa-smog",
    "Thunderstorm": "fa-bolt"
  };

  icon.className = `fa-solid ${iconMap[weatherMain] || "fa-cloud"}`;
}
