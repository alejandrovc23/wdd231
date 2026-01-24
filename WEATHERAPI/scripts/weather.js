// select HTML elements in the document
const myTown = document.querySelector('#town');
const myDescription = document.querySelector('#description');
const myTemperature = document.querySelector('#temperature');
const myGraphic = document.querySelector('#graphic');   

// CREATE REUIRED VARIABLES FOR THE URL
const myKey = "953b879879fbf6b212389665de1b67a3"
const myLat = "49.75958881721852"
const myLong = "6.644292609681261"


// Construct URL
const myURL = `https://api.openweathermap.org/data/2.5/weather?lat=${myLat}&lon=${myLong}&appid=${myKey}&units=imperial`;

// Try to grab the current weather data

async function apiFetch() {
  try {
    const response = await fetch(myURL);
    if (response.ok) {
      const data = await response.json();

      displayResults(data); // uncomment when ready
    } else {
        throw Error(await response.text());
    }
  } catch (error) {
      console.log(error);
  }
}

apiFetch();



// Display the JSON data into my web page
function displayResults(data) {
   
    myTown.innerHTML = data.name;
    myDescription.innerHTML = data.weather[0].description;
    myTemperature.innerHTML = `${data.main.temp} &deg;F`;
    const iconscr = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    myGraphic.setAttribute('src', iconscr);
    myGraphic.setAttribute('alt', data.weather[0].description);
  }