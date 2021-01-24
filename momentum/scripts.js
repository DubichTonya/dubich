let screenDate = document.querySelector('.date');
let screenTime = document.querySelector('.time');
let greeting = document.querySelector('.greeting');
let body = document.querySelector('body');
let changeImgBtn = document.querySelector('.changeImage');
let bg = getComputedStyle(body).backgroundImage;
let name = document.querySelector('.name');
let focus = document.querySelector('.focus');
let isImgBreak = false;
let imagesPath = ['images_2', 'images_1']
let numPath = 0;
let i = 0;
const weatherBtn = document.querySelector('.weatherBtn')
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.windSpeed');
const humidity = document.querySelector('.humidity')
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
let bgArr = ['24.jpg', '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg', '23.jpg']
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');
const quoteBtn = document.querySelector('.quoteBtn');

weatherBtn.addEventListener('click', () => {
  document.querySelector('.weatherBlock').classList.toggle('active')
})


async function getQuote() {
  const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
  const res = await fetch(url);
  if(!res.ok) {
    blockquote.textContent = `Error. The server is unavailable or the request limit is exceeded! Have a good day`;
    figcaption.textContent = `Good person`;
  } else {
    const data = await res.json();
    blockquote.textContent = data.quoteText;
    figcaption.textContent = data.quoteAuthor;
  };
}

function setNumNumber() {
  if (localStorage.getItem('imgNum') === null) {
    localStorage.setItem('imgNum', numPath);
  } else {
    numPath = +localStorage.getItem('imgNum') + 1;
    localStorage.setItem('imgNum', +numPath);
  }
}

function changeImageNum() {
  if (numPath >= imagesPath.length) {
    numPath = 0
    localStorage.setItem('imgNum', 0);
  }
}


function addZero(num) {
  return (parseInt(num, 10) < 10 ? '0' : '') + num
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=fbd89036643239d2de0a76a9cc1624fc&units=metric`;
  const res = await fetch(url);
  if(!res.ok) {
    city.textContent = "Incorrect city name";
    setTimeout(function(){
      city.textContent = "Lugansk";
      localStorage.setItem('city', city.textContent = "Lugansk")
    }, 3000)
  } else {
    const data = await res.json();
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    windSpeed.textContent = `Wind speed: ${data.main.humidity}`;
    humidity.textContent = `Humidity: ${data.wind.speed}`;
    weatherDescription.textContent = data.weather[0].description;
  
  }


}


document.addEventListener("DOMContentLoaded", function () {

  getWeather()

  setNumNumber()
  changeImageNum()

  function currentDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let today = new Date();
    let day = `${days[today.getDay()]}`;
    let date = `${today.getDate()}`;
    let month = `${months[today.getMonth()]}`;
    screenDate.textContent = `${day}, ${month} ${date}`
  }
  currentDate()

  function time() {
    let today = new Date();
    let hour = addZero(today.getHours());
    let minutes = addZero(today.getMinutes());
    let seconds = addZero(today.getSeconds())

    screenBg()
    screenGreeting()

    if (hour === 24) {
      hour = `00`
    } else if (hour === 1) {
      currentDate()
    }
    screenTime.textContent = `${hour} : ${minutes} : ${seconds}`;
    setTimeout(time, 1000);

    if (screenTime.textContent === '00:00:00' || screenTime.textContent === '06:00:00' ||
      screenTime.textContent === '12:00:00' || screenTime.textContent === '18:00:00') {
      screenGreeting()
    }
  }
  time()

  function screenGreeting() {
    let today = new Date();
    let hour = today.getHours();
    if (hour < 6) {
      greeting.textContent = "Good night,"
    } else if (hour >= 6 && hour < 12) {
      greeting.textContent = "Good morning,"
    } else if (hour >= 12 && hour < 18) {
      greeting.textContent = "Good afternoon,"
    } else {
      greeting.textContent = "Good evening,"
    }
  }


  function screenBg() {
    let today = new Date();
    if (bgArr[today.getHours()] === bg.match(/\d{2}\.jpg/g) || isImgBreak) {
      return
    } else {
      body.style.backgroundImage = `url(./assets/${imagesPath[numPath]}/${bgArr[today.getHours()]})`
    }
  }
  
  screenBg()

  function viewBgImage(data) {
    const body = document.querySelector('body');
    const src = data;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {      
      body.style.backgroundImage = `url(${src})`;
    }; 
  }

  changeImgBtn.addEventListener('click', function () {
    viewBgImage(`./assets/${imagesPath[numPath]}/${bgArr[i%23]}`);
    changeImgBtn
    i++;
    isImgBreak = true;
    changeImgBtn.disabled = true;
    setTimeout(function() { changeImgBtn.disabled = false }, 1000);
  })

  name.addEventListener('keypress', setName)
  name.addEventListener('blur', setName)
  focus.addEventListener('keypress', setFocus)
  focus.addEventListener('blur', setFocus)
  city.addEventListener('keypress', setCity)
  city.addEventListener('blur', setCity)

  function setName(e) {
    if (e.type === 'keypress') {
      if (e.which === 13 || e.keyCode === 13) {
        if (e.target.innerText === ` [Enter Name] !` || e.target.innerText === '') {
          name.textContent = ` [Enter Name] !`
        } else {
          localStorage.setItem('name', `${e.target.innerText} !`);
        }
        name.blur()
      }
    } else {
      if (e.target.innerText === ` [Enter Name] !` || e.target.innerText === '') {
        name.textContent = ` [Enter Name] !`
      } else {
        localStorage.setItem('name', `${e.target.innerText} !`);
      }
    }
  }

  function setFocus(e) {
    if (e.type === 'keypress') {
      if (e.which === 13 || e.keyCode === 13) {
        if (e.target.innerText === ` [Enter Focus]` || e.target.innerText === '') {
          focus.textContent = ` [Enter Focus]`
        } else {
          localStorage.setItem('focus', e.target.innerText);
        }
        focus.blur()
      }
    } else {
      if (e.target.innerText === ` [Enter Focus]` || e.target.innerText === '') {
        focus.textContent = ` [Enter Focus]`
      } else {
        localStorage.setItem('focus', e.target.innerText);
      }
    }
  }

  function setCity(e) {
    if (e.type === 'keypress') {
      if (e.which === 13 || e.keyCode === 13) {
        console.log(e.target.innerText)
        if (e.target.innerText === `Lugansk` || e.target.innerText === '') {
          city.textContent = `Lugansk`
        } else {
          localStorage.setItem('city', e.target.innerText);
          getWeather()
        }
        city.blur()
      }
    } else {
      if (e.target.innerText === `Lugansk` || e.target.innerText === '') {
        city.textContent = `Lugansk`
      } else {
        localStorage.setItem('city', e.target.innerText);
        getWeather()
      }
    }
  }

  function getName() {
    if (localStorage.getItem('name') === null) {
      name.textContent = ` [Enter Name] !`
    } else {
      name.textContent = localStorage.getItem('name');
    }
  }

  function getFocus() {
    if (localStorage.getItem('focus') === null) {
      focus.textContent = ` [Enter Focus]`
    } else {
      focus.textContent = localStorage.getItem('focus');
    }
  }
  function getCity() {
    if (localStorage.getItem('city') === null) {
      city.textContent = `Lugansk`
    } else {
      city.textContent = localStorage.getItem('city');
    }
  }
  getCity() 
  getName()
  getFocus()


  focus.addEventListener('click', () => {
    focus.textContent = ``;
    focus.focus();
  })

  name.addEventListener('click', () => {
    name.textContent = ``;
    name.focus();
  })

  city.addEventListener('click', () => {
    city.textContent = ``;
    city.focus();
  })


  getQuote()
  quoteBtn.addEventListener('click', getQuote);
});