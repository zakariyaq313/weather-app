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

document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

function setWeather(data) {
    let celsius = `${Math.round(parseFloat(data.main.temp) - 273.15)}°C`,
        imageSource = document.querySelector("img.image"),
        cardBackground = document.querySelector("div.card");
    document.querySelector("p.weather").textContent = data.weather[0].main;
    document.querySelector("h1.city").textContent = data.name;
    document.querySelector("h2.temp").textContent = celsius;

    switch (data.weather[0].main) {
        case "Haze":
        case "Smoke":
        case "Mist":
        case "Dust":
        case "Fog":
            imageSource.src = "images/global-warming.svg";
            cardBackground.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,229,168,1) 0%, rgba(251,174,222,1) 100.7% )";
            break;

        case "Clouds":
            imageSource.src = "images/cloudy.svg";
            cardBackground.style.backgroundImage = "linear-gradient( 114.2deg,  rgba(121,194,243,1) 22.6%, rgba(255,180,239,1) 67.7% )";
            break;

        case "Snow":
            imageSource.src = "images/snow.svg";
            cardBackground.style.backgroundImage = "radial-gradient(circle 465px at -15.1% -25%, rgba(17,130,193,1) 0%, rgba(67,166,238,1) 49%, rgba(126,203,244,1) 90.2% )";
            break;

        case "Thunderstorm":
            imageSource.src = "images/storm.svg";
            cardBackground.style.backgroundImage = "linear-gradient( 109.6deg,  rgba(48,207,208,1) 11.2%, rgba(51,8,103,1) 92.5% )";
            break;

        case "Clear":
            imageSource.src = "images/sun.svg";
            cardBackground.style.backgroundImage = "linear-gradient(to bottom right, #b3ffab, #12fff7)";
            break;
        
        case "Rain":
        case "Drizzle":
            imageSource.src = "images/rainy.svg";
            cardBackground.style.backgroundImage = "radial-gradient( circle 465px at -15.1% -25%,  rgba(17,130,193,1) 0%, rgba(67,166,238,1) 49%, rgba(126,203,244,1) 90.2% )";
            break;
        
        default:
            imageSource = "images/wind.svg";
            cardBackground.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%,  rgba(253,101,133,1) 0%, rgba(255,211,165,1) 90% )";
            break;
    }
}

function getWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput.value}&appid=b0c90ee33b0ac413a9614d297708aa07`) 
    .then( (response) => { 
        return response.json();
    })
    
    .then( (data) => {
      setWeather(data);
    })

    .catch( () => {
      // catch any errors
    });
}

let cards = document.querySelectorAll("div.card");
function removeCard() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].remove();
    }
}

function addCard() {
    let newCard = document.createElement("div");
        newCard.classList.add("card");
        document.querySelector("div.cards").appendChild(newCard);
        newCard.innerHTML = `<span class="weather-icon">
                                <img src="" alt="" class="image">
                                <p class="weather"></p>
                            </span>
                            <span class="details">
                                <h2 class="temp"></h2>
                                <h1 class="city"></h1>
                            </span>`;
}

button.addEventListener("click", () => {
    getWeather();
    removeCard();
    addCard();
})

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getWeather();
        removeCard();
        addCard();
    }
})

erase.addEventListener("click", () => {
    userInput.value = "";
})