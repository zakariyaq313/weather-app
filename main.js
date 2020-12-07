let userInput = document.getElementById("search"),
    button = document.querySelector('button[type="submit"]');

document.querySelector("form.search-box").addEventListener("submit", (e) => {
    e.preventDefault();
})

function getWeather(data) {
    let celsius = Math.round(parseFloat(data.main.temp) - 273.15);
    document.querySelector("p.weather").textContent = data.weather[0].main;
    document.querySelector("h1.city").textContent = data.name;
    document.querySelector("h2.temp").textContent = celsius;
}

button.addEventListener("click", () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput.value}&appid=b0c90ee33b0ac413a9614d297708aa07`) 
    .then(function(resp) { 
        return resp.json() 
    })
    
    .then(function(data) {
      console.log(data);
      getWeather(data);
    })

    .catch(function() {
      // catch any errors
    });
})