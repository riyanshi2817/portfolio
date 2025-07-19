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

const api = ;

getBtn.addEventListener("click", () =>{
    const city  = input.value.trim();
    if(city){
        getWeatherByCity(city);
    }
});

locationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    getWeatherByCoords(latitude, longitude);
  }, () => {
    alert("Unable to access your location.");
  });
});

function getWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => updateUI(data))
    .catch(() => alert("City not found or network error."));
}

function updateUI(data) {
  if (data.cod === "404") {
    alert("City not found");
    return;
  }