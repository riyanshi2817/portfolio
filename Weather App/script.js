const input = document.querySelector("input");
const button = document.querySelector("button");
const weatherPart = document.querySelector(".weather-part");
const temp = document.querySelector(".temp");
const description = document.querySelector(".description");
const locationDisplay = document.querySelector(".location");
const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");

const api = "058fcd8fc2a65dbe74cb86086607245a";

button.addEventListener("click", async () => {
  const city = input.value.trim();
  if (city === "") return;

  const apiUrl = `http://api.weatherstack.com/current?access_key=${api}&query=${city}`;
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.success === false || data.error) {
      alert("City not found or API error.");
      return;
    }

    temp.textContent = `${data.current.temperature}°C`;
    description.textContent = data.current.weather_descriptions[0];
    locationDisplay.textContent = `${data.location.name}, ${data.location.country}`;
    feelsLike.textContent = `${data.current.feelslike}°C`;
    humidity.textContent = `${data.current.humidity}%`;

    weatherPart.classList.remove("hide");
  } catch (err) {
    alert("Failed to fetch weather data.");
  }
});
