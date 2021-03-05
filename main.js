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

let skeletonRemove = () => {
    let cards = document.querySelectorAll("div.card");
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("skeleton");
    }
}

window.onload = skeletonRemove;

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

    card.children[1].children[1].textContent = data.weather[0].main;
    card.children[2].textContent = time();
    card.children[0].textContent = data.name;
    card.children[1].children[0].textContent = celsius;

    switch (data.weather[0].main) {
        
        case "Smoke":
            card.style.backgroundImage = 'url("images/smoke.jpg")';
            break;
        
        case "Dust":
            card.style.backgroundImage = 'url("images/sand.jpg")';
            break;

        case "Haze":
        case "Mist":
        case "Fog":
            card.style.backgroundImage = 'url("images/fog.jpg")';
            break;

        case "Clouds":
            card.style.backgroundImage = 'url("images/clouds.jpg")';            
            break;

        case "Snow":
            card.style.backgroundImage = 'url("images/snow.png")';
            break;

        case "Thunderstorm":
            card.style.backgroundImage = 'url("images/storm.jpg")';
            break;

        case "Clear":
            if (celsius <= 0) {
                card.style.backgroundImage = 'url("images/snow.jpg")';
            } else {
                if ((currentHour >= 7) && (currentHour < 18)) {
                    card.style.backgroundImage = 'url("images/clear.jpg")';
                } else {
                    card.style.backgroundImage = 'url("images/night.jpg")';
                }
            }
            break;
        
        case "Rain":
            card.style.backgroundImage = 'url("images/rain.jpg")';
            break;

        case "Drizzle":
            card.style.backgroundImage = 'url("images/drizzle.jpg")';
            break;
        
        default:
            card.style.backgroundImage = 'url("images/clear.jpg")';
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
        console.log(data);
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
        newCard.innerHTML = `<p class="city"></p>
                            <div class="main-content">
                                <h1 class="temp"></h2>
                                <h2 class="weather"></h1>
                            </div>
                            <p class="time"></p>`;
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