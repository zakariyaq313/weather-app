(function () {
    'use strict';
    let date = new Date();
    let weekDay = date.toLocaleDateString("default", {weekday: "long"});
    let day = date.getDate(); 
    let month = date.toLocaleDateString("default", {month: "long"});
    let year = date.getFullYear();

    document.querySelector("h1.day").textContent = weekDay;
    document.querySelector("h2.date").textContent = `${day} ${month}, ${year}`;
}());

let skeletonRemove = () => {
    let cards = document.querySelectorAll("div.card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("skeleton");
    }
}

window.onload = skeletonRemove;

let userInput = document.getElementById("search"),
    search = document.querySelectorAll("svg.icon")[0],
    erase = document.querySelectorAll("svg.icon")[1];

// Prevent page reload on form submit
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

function setWeather(data, count) {
    let currentHour = new Date().getUTCHours() + Math.round(data.timezone / 3600),
        card = document.querySelectorAll("div.card")[count],
        celsius = `${Math.round(parseFloat(data.main.temp) - 273.15)}°C`,
        currentMinutes = new Date().getUTCMinutes() + (data.timezone / 60),
        minutesEstimate = currentMinutes % 60,
        minutes,
        hour;

        if (minutesEstimate < 0) {
            minutes = 60 + minutesEstimate;
        } else {
            minutes = minutesEstimate;
        }

        if (minutes >= 30) {
            hour = new Date().getUTCHours() + Math.floor(data.timezone / 3600);
        } else {
            hour = new Date().getUTCHours() + Math.round(data.timezone / 3600);
        }

        const time = () => {
            let amOrPm = "AM";

            if ((hour >= 12) && (hour < 24)){
                amOrPm = "PM";
                hour = hour - 12;
                if (hour === 0) {
                    hour = 12;
                }
            } else if (hour > 24) {
                hour = hour - 24;
            } else {
                hour = 12;
            }

            if (minutes < 10) {
                minutes = '0' + minutes; 
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            return `${hour}:${minutes} ${amOrPm}`;
        }
    
    card.children[1].children[1].textContent = data.weather[0].main;
    card.children[2].textContent = time();
    card.children[0].textContent = data.name;
    card.children[1].children[0].textContent = celsius;
    
    // Background image of weather card
    let background;

    switch (data.weather[0].main) {

        case "Rain":
            background = "rain.jpg";
        break;

        case "Drizzle":
            background = "drizzle.jpg";
        break;
    
        case "Thunderstorm":
            background = "storm.jpg";
        break;
        
        case "Smoke":
            background = "smoke.jpg";
        break;
        
        case "Dust":
        case "Haze":
            background = "dust.jpg";
        break;

        case "Mist":
        case "Fog":
            background = "fog.jpg";
        break;

        case "Snow":
            if ((currentHour >= 7) && (currentHour < 18)) {
                background = "snow.png";                
            } else {
                background = "snow-alt.jpg";
            }
        break;

        case "Clouds":
            if ((Math.round(parseFloat(data.main.temp) - 273.15)) <= 0) {
                background = "snow.png";

            } else {
                if ((currentHour >= 7) && (currentHour < 18)) {
                    background = "clouds.jpg";
                } else {
                    background = "clouds-alt.jpg";
                } 
            }
        break;

        case "Clear":
            if ((Math.round(parseFloat(data.main.temp) - 273.15)) <= 0) {
                background = "snow.png";
            }
            
            else {
                if ((currentHour >= 7) && (currentHour < 18)) {
                    if ((Math.round(parseFloat(data.main.temp) - 273.15)) >= 28) {
                        background = "sunny.png";
                    } else{
                        background = "clear.jpg";
                    }
                } 
                
                else {
                    background = "night.jpg";
                }
            }
        break;

        default:
            background = "clear.jpg";
        break;
    }

    // Setting the card background image
    card.style.backgroundImage = `url("images/${background}")`;
}

function handleError(){
    document.querySelector("div.cards").style.display = "none";
    document.querySelector("div.not-found").style.display = "flex";
}

function errorSolved(){
    document.querySelector("div.cards").style.display = "grid";
    document.querySelector("div.not-found").style.display = "none";
}

function getWeather(count, cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b0c90ee33b0ac413a9614d297708aa07`)

    .then( (response) => {
        if (response.ok) {
            return response.json();
        }

        return Promise.reject(response);
    })

    .then( (data) => {
        setWeather(data, count);
      })

    .catch( () => {
      handleError();
    });
}

function removeCards() {
    let cards = document.querySelectorAll("div.card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].remove();
    }
}

function addCard(index, cityName) {
    // Create elements
    let newCard = document.createElement("div");
    let city = document.createElement("p");
    let container = document.createElement("div");
    let temperature = document.createElement("h1");
    let weather = document.createElement("h2");
    let time = document.createElement("p");

    // Add classes
    newCard.classList.add("card", "skeleton");
    city.className = "city";
    temperature.className = "temp";
    weather.className = "weather";
    time.className = "time";

    // Append/arrange elements in DOM
    document.querySelector("div.cards").appendChild(newCard);
    newCard.appendChild(city);
    newCard.appendChild(container);
    newCard.appendChild(time);
    container.appendChild(temperature);
    container.appendChild(weather);

    getWeather(index, cityName);
}

function newCity() {
    addCard(0, userInput.value);
}

let defaultCities = () => {
    addCard(0, "Delhi");
    addCard(1, "London");
    addCard(2, "Moscow");
    addCard(3, "Tokyo");
}

defaultCities();

function mainHandler(){
    removeCards();
        newCity();   
        if (document.querySelector("div.not-found").style.display = "flex") {
            errorSolved();
        }

    document.querySelector("div.cards").style.gridTemplateColumns = "1fr";
}

search.addEventListener("click", () => {
    if (userInput.value.trim() !== "") {
        mainHandler();
    }
})

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (userInput.value.trim() !== "") {
            mainHandler();
        }
    }
})

erase.addEventListener("click", () => {
    userInput.value = "";
})