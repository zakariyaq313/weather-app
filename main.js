// Date and week day 
(function () {
    'use strict';
    let date = new Date();
    let dayString = date.toLocaleDateString("default", {
        weekday: "long"
    });
    let day = date.getDate();
    let month = date.toLocaleDateString("default", {
        month: "long"
    });

    document.querySelector("h1.day").textContent = dayString;
    document.querySelector("h2.month").textContent = `${day} ${month}`;
}());


let userInput = document.getElementById("search"),
    button = document.querySelectorAll("i.icon")[0],
    erase = document.querySelectorAll("i.icon")[1];

// Prevent page reload on form submit 
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

// Funtion for filling data in div card
function setWeather(data, count) {

    // Current time of any location is UTC time + the location's time zone offset
    let currentHour = new Date().getUTCHours() + Math.round(data.timezone / 3600),

        card = document.querySelectorAll("div.card")[count],
        image = card.children[0].children[0],
        celsius = `${Math.round(parseFloat(data.main.temp) - 273.15)}°C`,

        // Difference of time in minutes between UTC and given location's time
        minutesDifference = new Date().getUTCMinutes() + (data.timezone / 60),

        // We need minutes from 0 to 59, if total minutes >= 60, we remove every 60 minutes
        // (because they make up an hour) and save the remainder
        minutesEstimate = minutesDifference % 60,

        minutes,
        hour = new Date().getUTCHours() + Math.round(data.timezone / 3600);

        if (minutesEstimate < 0) {
            // For locations whose time is behind UTC, their minutesEstimate will be in negative
            // Changing their sign won't do much, instead it will make minutes move from 59 to 0
            // Instead of changing sign, we can add negative minutes with 60, that gives the correct time
            minutes = 60 + minutesEstimate;
        } else {
            minutes = minutesEstimate;
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

            if (minutes < 10) {
                minutes = '0' + minutes; 
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            return `${hour}:${minutes} ${amOrPm}`;
        }

    // Content of div that will be created
    card.children[0].children[1].textContent = data.weather[0].main;
    card.children[1].children[0].textContent = time();
    card.children[1].children[1].children[1].textContent = data.name;
    card.children[1].children[1].children[0].textContent = celsius;

    // Weather icon and div card background to be determined based on various conditions
    switch (data.weather[0].main) {
        
        case "Smoke":
            if (data.weather[0].main === "Smoke") {
                image.src = "images/global-warming.svg";
            } else {
                image.src = "images/fog.svg";   
            }
            card.style.backgroundImage = "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)";
            break;
        
        case "Dust":
        case "Haze":
        case "Mist":
        case "Fog":
            if ((currentHour >= 7) && (currentHour <= 19)) {
                image.src = "images/fog.svg";
            } else {
                image.src = "images/fog-alt.svg";
            }
            card.style.backgroundImage = "linear-gradient(to bottom right, #355c7d, #6c5b7b, #c06c84)";
            break;

        case "Clouds":
            if ((currentHour >= 7) && (currentHour <= 19)) {
                image.src = "images/cloudy.svg";
            } else {
                image.src = "images/cloudy-alt.svg";
            }
            card.style.backgroundImage = "linear-gradient(to bottom right, #3494e6, #ec6ead)";
            break;

        case "Snow":
            image.src = "images/snow.svg";
            card.style.backgroundImage = "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)";
            break;

        case "Thunderstorm":
            image.src = "images/storm.svg";
            card.style.backgroundImage = "linear-gradient( 109.6deg,  rgba(48,207,208,1) 11.2%, rgba(51,8,103,1) 92.5% )";
            break;

        case "Clear":
            // card.style.backgroundImage = "linear-gradient(to bottom right, #00b09b, #96c93d)";
            card.style.backgroundImage = "linear-gradient( to bottom right,  rgba(255,219,47,.95) 11.2%, rgba(244,253,0,.95) 100.2% )";

            if ((currentHour >= 7) && (currentHour < 18)) {
                if ((Math.round(parseFloat(data.main.temp) - 273.15)) <= 0 ) {
                    image.src = "images/snowflake.svg";
                    card.style.backgroundImage = "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)";
                } else if ((Math.round(parseFloat(data.main.temp) - 273.15)) >= 30) {
                    image.src = "images/heatwave.svg";
                } else {
                    image.src = "images/sunny.svg";
                }
            } else {
                if ((Math.round(parseFloat(data.main.temp) - 273.15)) <= 0 ) {
                    image.src = "images/snowflake.svg";
                } else {
                    image.src = "images/moon.svg";
                }
                card.style.backgroundImage = "linear-gradient(to bottom right, #485563, #29323c)";
            }
            break;
        
        case "Rain":
        case "Drizzle":
            image.src = "images/rainy.svg";
            card.style.backgroundImage = "linear-gradient(to bottom right, #00c6ff, #0072ff)";
            break;
        
        default:
            image.src = "images/wind.svg";
            card.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%,  rgba(253,101,133,1) 0%, rgba(255,211,165,1) 90% )";
            break;
    }
}

// If there's an error in API request
function handleError(){
    document.querySelector("div.cards").style.display = "none";
    document.querySelector("div.not-found").style.display = "flex";
}

// After the said error is resolved
function errorSolved(){
    document.querySelector("div.cards").style.display = "grid";
    document.querySelector("div.not-found").style.display = "none";
}

// Get weather from API
function getWeather(count, cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b0c90ee33b0ac413a9614d297708aa07`) 
    .then( (response) => { 
        return response.json();
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

// Function for creating a new card
function addCard(index, cityName) {
    let newCard = document.createElement("div");
        newCard.classList.add("card");
        document.querySelector("div.cards").appendChild(newCard);
        newCard.innerHTML = `<span class="weather-icon">
                                <img src="" alt="" class="image">
                                <p class="weather"></p>
                            </span>
                            <span class="details">
                                <p class="time"></p>
                                <span class="main-content">
                                    <h2 class="temp"></h2>
                                    <h1 class="city"></h1>
                                </span>
                            </span>`;
    getWeather(index, cityName);
}

// For creating based on user input
function newCity() {
    addCard(0, userInput.value);
}

// Default displayed cities
let defaultCities = () => {
    addCard(0, "Delhi");
    addCard(1, "London");
    addCard(2, "Moscow");
    addCard(3, "Tokyo");
}

defaultCities();

function mainHandler(){
    if (userInput.value.trim() === "") {
        //do nothing
    } else {
        removeCards();
        newCity();   
        if (document.querySelector("div.not-found").style.display = "flex") {
            errorSolved();
        }
    }
    
    document.querySelector("div.cards").style.gridTemplateColumns = "1fr";
}

button.addEventListener("click", () => {
    mainHandler();
})

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        mainHandler();
    }
})

erase.addEventListener("click", () => {
    userInput.value = "";
})