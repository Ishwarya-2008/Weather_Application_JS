let defaultCity = "Tenkasi";

window.onload = function () {
    fetchWeatherData(defaultCity);
}

document.getElementById("cityInput")
    .addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            fetchWeatherData();
        }
    });

function fetchWeatherData(city) {
    const inputCity = document.getElementById("cityInput").value;
    let currentCity = city || inputCity || defaultCity;
    document.getElementById("currentCity").innerText = currentCity;
    
    let today = new Date();
    let day = today.toLocaleDateString("en-US", { weekday: "long" });
    let datePart = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric"
    });
    let time = today.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
    document.getElementById("time").innerText = day + ", " + datePart + " " + today.getFullYear() + " | " + time;
    
    const API_KEY = "c04dab1debc0f3c8515a011ed365ed06";

    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + API_KEY + "&units=metric";
    let forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + currentCity + "&appid=" + API_KEY + "&units=metric";

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.getElementById("climate").innerText = data.weather[0].description;
            document.getElementById("temp").innerText = Math.floor(data.main.temp) + "°";
            document.getElementById("feelsLike").innerText = "RealFeel " + Math.floor(data.main.feels_like) + "°";
            document.getElementById("humidity").innerText = "Humidity: " + data.main.humidity + "%";
            document.getElementById("wind").innerText = "Wind: " + data.wind.speed + " m/s";
            document.getElementById("pressure").innerText = "Pressure: " + data.main.pressure + " mb";

            let iconCode = data.weather[0].icon;
            let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            document.getElementById("weatherIcon").src = iconUrl;
        })
        .catch(err => console.error("Weather fetch error:", err));

    fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
            let forecastGrid = document.getElementById("forecastGrid");
            forecastGrid.innerHTML = "";
            let dayIndexes = [8, 16, 24, 32];

            dayIndexes.forEach((index) => {
                if (index < data.list.length) {
                    let forecastData = data.list[index];
                    let date = new Date(forecastData.dt * 1000);
                    let dayName = date.toLocaleDateString("en-US", { weekday: "long" });
                    let dateFormatted = date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
                    let temp = Math.floor(forecastData.main.temp);
                    let feelsLike = Math.floor(forecastData.main.feels_like);
                    let description = forecastData.weather[0].description;
                    let iconCode = forecastData.weather[0].icon;
                    let iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                    
                    let forecastDay = document.createElement("div");
                    forecastDay.className = "forecast-day";
                    forecastDay.innerHTML = `
                        <h4>${dayName}, ${dateFormatted}</h4>
                        <img src="${iconUrl}" alt="weather">
                        <div class="high-temp">${temp}°</div>
                        <div class="low-temp">${feelsLike}°</div>
                        <div class="description">${description}</div>
                    `;
                    forecastGrid.appendChild(forecastDay);
                }
            });
        })
        .catch(err => console.error("Forecast fetch error:", err));
}