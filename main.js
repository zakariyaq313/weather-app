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

let skeleton = () => {
    let cards = document.querySelectorAll("div.card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("skeleton");
    }
}

window.onload = skeleton;

let userInput = document.getElementById("search"),
    button = document.querySelectorAll("i.icon")[0],
    erase = document.querySelectorAll("i.icon")[1];

// Prevent page reload on form submit
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

function setWeather(data, count) {
    let currentHour = new Date().getUTCHours() + Math.round(data.timezone / 3600),
        card = document.querySelectorAll("div.card")[count],
        image = card.children[0].children[0],
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

    card.children[0].children[1].textContent = data.weather[0].main;
    card.children[1].children[0].textContent = time();
    card.children[1].children[1].children[1].textContent = data.name;
    card.children[1].children[1].children[0].textContent = celsius;

    switch (data.weather[0].main) {
        
        case "Smoke":
            image.src = "images/global-warming.svg";
            card.style.backgroundImage = "linear-gradient(to bottom right, #ffc371, #ff5f6d)";
            break;
        
        case "Dust":
            if ((currentHour >= 7) && (currentHour < 18)) {
                image.src = "images/fog.svg";
                card.style.backgroundImage = "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)";
            } else {
                image.src = "images/fog-alt.svg";
                card.style.backgroundImage = "linear-gradient(to bottom right, #ffc371, #ff5f6d)";
            }
            break;

        case "Haze":
        case "Mist":
        case "Fog":
            if ((currentHour >= 7) && (currentHour < 18)) {
                image.src = "images/fog.svg";
            } else {
                image.src = "images/fog-alt.svg";
            }
            card.style.backgroundImage = "linear-gradient(to bottom right, #f3904f, #3b4371)";
            break;

        case "Clouds":
                if ((currentHour >= 7) && (currentHour < 18)) {
                    if ((Math.round(parseFloat(data.main.temp) - 273.15)) <= 0) {
                        card.style.backgroundImage = "linear-gradient(to bottom right, #0093E9 0%, #80D0C7 100%)";
                    } else {
                        card.style.backgroundImage = "linear-gradient(to top right, #3494e6, #ec6ead)"; 
                    }
                    image.src = "images/cloudy.svg";
                } else {
                    image.src = "images/cloudy-alt.svg";
                    card.style.backgroundImage = "linear-gradient(to bottom right, #b06ab3, #4568dc)";
                }            
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
            card.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%, rgba(255,200,124,1) 0%, rgba(252,251,121,1) 90% )";
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
            card.style.backgroundImage = "linear-gradient(to bottom right, #a6ffcb, #12d8fa, #1fa2ff )";
            break;
        
        default:
            image.src = "images/wind.svg";
            card.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%,  rgba(253,101,133,1) 0%, rgba(255,211,165,1) 90% )";
            break;
    }
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
    let newCard = document.createElement("div");
        newCard.classList.add("card", "skeleton");
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

function newCity() {
    addCard(0, userInput.value);
}

let defaultCities = () => {
    addCard(0, "Delhi");
    addCard(1, "London");
    addCard(2, "Tokyo");
    addCard(3, "Moscow");
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

button.addEventListener("click", () => {
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