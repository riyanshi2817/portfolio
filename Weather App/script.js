const input = document.querySelector("input");
const button = document.querySelector("button");
const weatherPart = document.querySelector(".weather-part");
const temp = document.querySelector(".temp");
const desc = document.querySelector(".description");
const loc = document.querySelector(".location");
const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");

const api = "058fcd8fc2a65dbe74cb86086607245a";

getBtn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city) {
    getWeatherByCity(city);
  }
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


