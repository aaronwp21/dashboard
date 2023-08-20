const today = new Date();

const todayFormatted = () => {
  const formatted = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted;
};

const displayDate = () => {
  const p = document.createElement('p');
  p.textContent = todayFormatted();
  return p;
};

const dateContainer = document.getElementById('date-wrapper');
dateContainer.append(displayDate());

const weatherContainer = document.getElementById('weather-wrapper');

function showSpinner(area) {
  area.innerHTML = `<div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
}

function showError(area) {
  area.innerHTML = `<p class="section-info">Sorry this cannot be loaded</p>`;
}

function renderWeather(data) {
  weatherContainer.innerHTML = `<div id="location-container" class="location-container">
        <p class="section-titles">Location</p>
      <p class="section-info">${data.location.name}</p></div>
      <div class="current-container">
        <div class="forecast-wrapper">
          <p class="section-titles">Forecast</p>
          <div id="temp-wrapper" class="weather-temp">
          <img src=${data.current.condition.icon} alt=${data.current.condition.text}><p class="section-info">${data.current.temp_c}°C</p></div>
        </div>
        <div class="sunrise-sunset-container">
          <p class="section-titles">Sunrise/Sunset</p>
          <div id="sunrise" class="sunrise-sunset">
          <img src="/assets/weather/64x64/day/113.png" alt="Sunrise"><p class="section-info">${data.forecast.forecastday[0].astro.sunrise}</p></div>
          <div id="sunset" class="sunrise-sunset">
          <img src="/assets/weather/64x64/night/113.png" alt="Sunset"><p class="section-info">${data.forecast.forecastday[0].astro.sunset}</p></div>
        </div>
      </div>`;
}

async function getWeather() {
  showSpinner(weatherContainer);
  try {
    const position = await new Promise((resolve, reject) => {
      return navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      });
    });
    const { latitude, longitude } = position.coords;
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=d164cbfef0cd4d0b9e7200203230302&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`,
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    renderWeather(data);
  } catch (err) {
    showError(weatherContainer);
  }
}

getWeather();

const jokeWrapper = document.getElementById('joke-wrapper');

function renderJoke(data) {
  jokeWrapper.innerHTML = `<p class="section-titles">Daily Joke</p>
  <p class="section-info">${data.joke}</p>`;
}

async function getJoke() {
  showSpinner(jokeWrapper);
  try {
    const response = await fetch(
      'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun,Spooky?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single',
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    renderJoke(data);
  } catch (err) {
    showError(jokeWrapper);
  }
}

getJoke();

const footballWrapper = document.getElementById('football-wrapper');

function renderFootball(data) {
  footballWrapper.removeChild(footballWrapper.firstChild);
  const gamesWrapper = document.createElement('div');
  gamesWrapper.classList.add('games-wrapper');

  footballWrapper.append(gamesWrapper);
  const todaysGamesP = document.createElement('p');
  todaysGamesP.classList.add('section-titles');
  todaysGamesP.textContent = 'Next 7 Games';
  footballWrapper.prepend(todaysGamesP);
  data.response.forEach((fixture) => {
    const gameContainer = document.createElement('div');
    gameContainer.classList.add('game-container');

    const homeDiv = document.createElement('div');
    homeDiv.classList.add('team-container');
    homeDiv.innerHTML = `<img class="team-image" src="${fixture.teams.home.logo}" alt="${fixture.teams.home.name} logo">
    <p class="team-name">${fixture.teams.home.name}</p>`;
    gameContainer.append(homeDiv);

    const versusDiv = document.createElement('div');
    versusDiv.classList.add('versus');
    versusDiv.textContent = 'V';
    gameContainer.append(versusDiv);

    const awayDiv = document.createElement('div');
    awayDiv.classList.add('team-container');
    awayDiv.innerHTML = `<img class="team-image" src="${fixture.teams.away.logo}" alt="${fixture.teams.away.name} logo">
    <p class="team-name">${fixture.teams.away.name}</p>`;
    gameContainer.append(awayDiv);

    gamesWrapper.append(gameContainer);
  });
}

const footballDate = new Date();
const footballDateFormatted = () => {
  const formatted = footballDate.toJSON();
  const matcher = /\w*\D\w*\D\w./;
  const found = formatted.match(matcher);
  return found[0];
};

async function getFootball() {
  showSpinner(footballWrapper);
  try {
    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?league=39&season=2022&next=7`,
      {
        method: 'GET',
        headers: {
          'x-apisports-key': '260f887bf200a22f7ac03f96833f7443',
        },
      },
    );

    if (!response.ok) {
      throw response;
    }

    const data = await response.json();
    renderFootball(data);
  } catch (err) {
    showError(footballWrapper);
  }
}

getFootball();
