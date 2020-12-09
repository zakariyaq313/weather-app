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


// Main part from here

let userInput = document.getElementById("search"),
    button = document.querySelectorAll("i.icon")[0],
    erase = document.querySelectorAll("i.icon")[1];

// Prevent page reload on form submit 
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
})

// Fill data in div card 
function setWeather(data, count) {
    let card = document.querySelectorAll("div.card")[count],
        image = card.children[0].children[0],
        celsius = `${Math.round(parseFloat(data.main.temp) - 273.15)}°C`;

    card.children[0].children[1].textContent = data.weather[0].main;
    card.children[1].children[1].textContent = data.name;
    card.children[1].children[0].textContent = celsius;

    switch (data.weather[0].main) {
        case "Haze":
        case "Smoke":
        case "Mist":
        case "Dust":
        case "Fog":
            image.src = "images/global-warming.svg";
            card.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%,  rgba(255,229,168,1) 0%, rgba(251,174,222,1) 100.7% )";
            break;

        case "Clouds":
            image.src = "images/cloudy.svg";
            card.style.backgroundImage = "linear-gradient( 114.2deg,  rgba(121,194,243,1) 22.6%, rgba(255,180,239,1) 67.7% )";
            break;

        case "Snow":
            image.src = "images/snow.svg";
            card.style.backgroundImage = "radial-gradient(circle 465px at -15.1% -25%, rgba(17,130,193,1) 0%, rgba(67,166,238,1) 49%, rgba(126,203,244,1) 90.2% )";
            break;

        case "Thunderstorm":
            image.src = "images/storm.svg";
            card.style.backgroundImage = "linear-gradient( 109.6deg,  rgba(48,207,208,1) 11.2%, rgba(51,8,103,1) 92.5% )";
            break;

        case "Clear":
            image.src = "images/sun.svg";
            card.style.backgroundImage = "linear-gradient(to bottom right, #b3ffab, #12fff7)";
            break;
        
        case "Rain":
        case "Drizzle":
            image.src = "images/rainy.svg";
            card.style.backgroundImage = "radial-gradient( circle 465px at -15.1% -25%,  rgba(17,130,193,1) 0%, rgba(67,166,238,1) 49%, rgba(126,203,244,1) 90.2% )";
            break;
        
        default:
            image.src = "images/wind.svg";
            card.style.backgroundImage = "radial-gradient( circle farthest-corner at 10% 20%,  rgba(253,101,133,1) 0%, rgba(255,211,165,1) 90% )";
            break;
    }
}

// Get weather from API 
function getWeather(count, cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName || userInput.value}&appid=b0c90ee33b0ac413a9614d297708aa07`) 
    .then( (response) => { 
        return response.json();
    })
    
    .then( (data) => {
      setWeather(data, count);
    })

    .catch( () => {
      // catch any errors
      console.log("Fuck that");
    });
}

let defaultCities = () => {
    getWeather(0, "Delhi");
    getWeather(1, "Pune");
    getWeather(2, "Bangalore");
    getWeather(3, "Mumbai");
}

defaultCities();

function removeCards() {
    let cards = document.querySelectorAll("div.card");    
    for (let i = 0; i < cards.length; i++) {
        cards[i].remove();
    }
} // In order to remove default divs

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
    document.querySelector("div.cards").style.gridTemplateColumns = "1fr";
    getWeather(0, userInput.value);
} //In order to add new div

button.addEventListener("click", () => {
    removeCards();
    addCard();
})

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (userInput.value.trim() === "") {
            console.log("This fucker right here");
        } else {
            removeCards();
            addCard();   
        }
    }
})

erase.addEventListener("click", () => {
    userInput.value = "";
})