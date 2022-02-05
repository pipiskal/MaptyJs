'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

let map;
let mapEvent;

class App {
  // private map field;
  #map;
  mapEvent;
  constructor() {
    // i want to get called when my main object  gets called
    this._getPossition();
    this._showForm();
  }

  _getPossition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // on success getting the access
        this._loadMap.bind(this),
        // of it fails to get the location
        this._onFailGettingPosition
      );
    }
  }

  _loadMap(position) {
    console.log(position);
    console.log('its running');
    //   const latidute = position.coords.latitude;
    //   const longtidute = position.coords.longitude;
    // or we can use destructuring
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];
    // map function take a string that is the id of the html element it will be displayed
    // L the main function Leaflet Namespace , gives as functions that we can use
    // So we select the html element where the map will appear
    //we chain function with setView and set up the coordinates that we got from
    // geolocation and the second parameter 13 is the zoom of the
    this.#map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling clicks on map and show the form when clicked
    this.#map.on('click', function (mapEle) {
      this.mapEvent = mapEle;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }

  _showForm() {}

  _toggleElevationField() {}

  _newWorkout() {}

  _onFailGettingPosition() {
    alert('Couldnt get your position');
  }
}

const app = new App();

// we lister for submit, when hitting enter is a submit
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // CLEAR Input fields the values not the whole element

  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  // we are getting the latitude and longitude based on our click on the map
  //     map on is a function from leaflet api
  const { lat, lng } = mapEvent.latlng;
  console.log(lat, lng);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout  😀')
    .openPopup();
});

inputType.addEventListener('change', function (e) {
  // it selects parents and not childer
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
