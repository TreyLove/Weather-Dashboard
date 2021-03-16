var tempEl = document.querySelectorAll(".temp")
var humEl = document.querySelectorAll(".humidity")
var windEl = document.querySelectorAll(".wind")
var uvEl = document.querySelectorAll(".uv-index")
var currentWeather = document.getElementById("current-weather")
var cardEl = document.querySelectorAll(".card")
var userInput = document.getElementById("user-input")
var submitBtn = document.getElementById("submit-button")
var savedLocs = document.getElementById("saved-locs")
var baseUrl = "https://api.openweathermap.org/data/2.5/onecall?"
var latUrl = "lat="
var lonUrl = "&lon="
var apiKey = "&appid=f6bb7958eec5a4c61edf97445f40df39&units=imperial&exclude=hourly,minutely,alerts"
var cordUrl1 = "https://api.opencagedata.com/geocode/v1/json?q="
var cordUrl2 = "&key=fdfcabc4f31f48398a936cc6ff4d4c31"
var cityList = []
// logs the saved city array into city list array if savedCitys exists and sets it to an empty array if it doesn't
try { cityList = JSON.parse(localStorage.getItem("savedCitys")) } catch (error) { }
if (cityList === null) {
    cityList = []
}
else {
    for (var i = 0; i < cityList.length; i++) {

        var li = document.createElement("li")
        li.textContent = cityList[i]
        savedLocs.appendChild(li)
    }
}

// grabs the coordinates of the city the user selected and dynamically inserts the city name into the current day card
async function grabCords(cityName) {
    var cordResponse = await fetch(cordUrl1 + cityName + cordUrl2)
    var cordParse = await cordResponse.json()
    //console.log(cordParse)
    var pairedGeo = cordParse.results[0].geometry
    var lat = pairedGeo.lat
    var lon = pairedGeo.lng
    var weatherUrl = baseUrl + latUrl + lat + lonUrl + lon + apiKey
    var city = cordParse.results[0].formatted
    //console.log(city);

    const card = cardEl[0];
    card.querySelector("h1").textContent = city
    // stops city names from repeating in the saved city list
    if (cityList.includes(city)) {
        console.log("city name repeated")
    }
    // inserts the city name into the saved locations
    else {
        while (savedLocs.firstChild) {
            savedLocs.removeChild(savedLocs.firstChild);
        }
        cityList.push(city)
        localStorage.setItem("savedCitys", JSON.stringify(cityList))
        for (var i = 0; i < cityList.length; i++) {

            var li = document.createElement("li")
            li.textContent = cityList[i]
            savedLocs.appendChild(li)
        }
    }


    // returns the url that is needed to get the data from the weather api
    return weatherUrl

}
// handles most of the information that is dynamically displayed on the page 
async function getWeatherInfo() {
    //parses the data from the weatherUrl
    var city = userInput.value
    var url = await grabCords(city)
    var weatherData = await fetch(url)
    var weatherObject = await weatherData.json()

    console.log(weatherObject);

    // dynamically inserts the current weather data into the corresponding card
    for (let i = 0; i < cardEl.length; i++) {
        if (i === 0) {
            var currentTemp = weatherObject.current.temp
            var currentHum = weatherObject.current.humidity
            var currentUv = weatherObject.current.uvi
            var currentWind = weatherObject.current.wind_speed
            var currentDate = weatherObject.current.dt
            var currentIcon = weatherObject.current.weather[0].icon
            var card = cardEl[i]

            var currentUvStatus = "background-color: red;"
            if (currentUv < 2) {
                currentUvStatus = "background-color: green;"
            }
            else if (currentUv < 6) {
                currentUvStatus = "background-color: yellow";
            }
            else if (currentUv < 8) {
                currentUvStatus = "background-color: orange"
            }
            // dynamically logs the weather data into the corresponding elements
            card.querySelector(".temp").textContent = "Temperature: " + currentTemp + "°F"
            card.querySelector(".humidity").textContent = "Humidity: " + currentHum + "%"
            card.querySelector(".uv-index").textContent = "UV Index: " + currentUv
            card.querySelector(".uv-index").setAttribute("style", currentUvStatus)
            card.querySelector(".wind").textContent = "Wind Speed: " + currentWind + " mph"
            card.querySelector("h2").textContent = moment.unix(currentDate).format('MM/ DD/ YY ')
            card.querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png")
        }
        // inserts the forcast data into the corresponding cards
        else {
            var temp = weatherObject.daily[i].temp.day
            var hum = weatherObject.daily[i].humidity
            var uv = weatherObject.daily[i].uvi
            var wind = weatherObject.daily[i].wind_speed
            var date = weatherObject.daily[i].dt
            var icon = weatherObject.daily[i].weather[0].icon
            var card = cardEl[i]
            // changes the color of the uv element based on the current uv index
            var uvStatus = "background-color: red;"
            if (uv < 2) {
                uvStatus = "background-color: green;"
            }
            else if (uv < 6) {
                uvStatus = "background-color: yellow";
            }
            else if (uv < 8) {
                uvStatus = "background-color: orange"
            }
            // dynamically logs the weather data into the corresponding elements
            card.querySelector(".temp").textContent = "Temperature: " + temp + "°F"
            card.querySelector(".humidity").textContent = "Humidity: " + hum + "%"
            card.querySelector(".uv-index").textContent = "UV Index: " + uv
            card.querySelector(".uv-index").setAttribute("style", uvStatus)
            card.querySelector(".wind").textContent = "Wind Speed: " + wind + " mph"
            card.querySelector("h2").textContent = moment.unix(date).format('MM/ DD/ YY ')
            card.querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
        }
    }
}
// listens to the submit button next to the input box and logs the chosen citys data on click
submitBtn.addEventListener("click", function () {
    getWeatherInfo()
})
// listens to the li elements underneath the input box and logs the chosen citys data on click
savedLocs.addEventListener("click", function (e) {
    //console.log(e);
    var chosenCity = (e.target.innerText)
    userInput.value = chosenCity
    getWeatherInfo()
})








