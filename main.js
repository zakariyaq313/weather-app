// Get date
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

// Prevent page reload on form submit
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

// Data to be filled in weather card
function setWeather(data, index) {
    let currentHour = new Date().getUTCHours() + Math.round(data.timezone / 3600);
    let card = document.querySelectorAll("div.card")[index];
    let celsius = `${Math.round(parseFloat(data.main.temp) - 273.15)}°C`;
    let currentMinutes = new Date().getUTCMinutes() + (data.timezone / 60);
    let minutesEstimate = currentMinutes % 60;
    let minutes;
    let hour;

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
            } 

            else if (hour > 24) {
                hour = hour - 24;
            } 
            
            else {
                hour = hour - 36;
            }

            if (minutes < 10) {
                minutes = '0' + minutes; 
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            return `${hour}:${minutes} ${amOrPm}`;
        }
    
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

    // Filling appropriate data
    card.style.backgroundImage = `url("images/${background}")`;
    card.children[1].children[1].textContent = data.weather[0].main;
    card.children[2].textContent = time();
    card.children[0].textContent = data.name;
    card.children[1].children[0].textContent = celsius;
}

let cardsContainer = document.querySelector("div.cards");
let errorMessage = document.querySelector("div.not-found");

function getWeather(index, cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b0c90ee33b0ac413a9614d297708aa07`)

    .then( (response) => {
        if (response.ok) {
            return response.json();
        }

        return Promise.reject(response);
    })

    .then( (data) => {
        setWeather(data, index);
    })

    .catch( () => {
        cardsContainer.style.display = "none";
        errorMessage.style.display = "flex";
    });
}

function createCard(index, cityName) {
    // Create elements
    let newCard = document.createElement("div");
    let city = document.createElement("p");
    let container = document.createElement("div");
    let temperature = document.createElement("h1");
    let weather = document.createElement("h2");
    let time = document.createElement("p");

    // Add classes
    newCard.classList.add("card", "skeleton-background");
    city.classList.add("city", "skeleton-text");
    container.className = "skeleton-text";
    temperature.className = "temp";
    weather.className = "weather";
    time.classList.add("time", "skeleton-text");

    // Append/arrange elements in DOM
    document.querySelector("div.cards").appendChild(newCard);
    newCard.appendChild(city);
    newCard.appendChild(container);
    newCard.appendChild(time);
    container.appendChild(temperature);
    container.appendChild(weather);

    getWeather(index, cityName);

    newCard.onload = setTimeout(() => {
        city.classList.remove("skeleton-text");
        container.classList.remove("skeleton-text");
        time.classList.remove("skeleton-text");
        newCard.classList.add("slide-down");

        setTimeout(() => {
            newCard.classList.remove("skeleton-background");
        }, 2000);
    }, 3000);
}

// Default cities
createCard(0, "Delhi");
createCard(1, "London");
createCard(2, "Moscow");
createCard(3, "Tokyo");

function removeCards() {
    let cards = document.querySelectorAll("div.card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].remove();
    }
}

function newCity() {
    createCard(0, userInput.value);
}

function mainHandler() {
    removeCards();
        newCity();

        if (errorMessage.style.display = "flex") {
            cardsContainer.style.display = "grid";
            errorMessage.style.display = "none";
        }

    cardsContainer.style.gridTemplateColumns = "1fr";
}

let userInput = document.querySelector("input.search");
let search = document.querySelectorAll("svg.icon")[0];
let erase = document.querySelectorAll("svg.icon")[1];

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (userInput.value.trim() !== "") {
            mainHandler();
        }
    }
})

search.addEventListener("click", () => {
    if (userInput.value.trim() !== "") {
        mainHandler();
    }
})

erase.addEventListener("click", () => {
    userInput.value = "";
})