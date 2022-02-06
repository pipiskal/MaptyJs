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

let inputValues = [inputDistance, inputDuration, inputCadence, inputElevation];

// when a global variable gets changeδ in a function the changes are vissible everywhere

let mapEvent, map;

// if navigator.geolocation exists
if (navigator.geolocation) {
  //
  navigator.geolocation.getCurrentPosition(
    function (position) {
      console.log(position);
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      // console.log(`https://www.google.com/maps/@latitude,longitude`);

      let coordinates = [latitude, longitude];

      // L.map('gets an id of an html element')
      map = L.map('map').setView(coordinates, 13);

      // creating the tile
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // we want on click to create a marker on the map depending on that click
      // so we call the map.on function that responds on clicks and calls a callbakc functions that gives us, as a parameter the map event
      map.on('click', function (mapE) {
        // mapEvent holds the latlng object holds the lat and long values
        // destructuring
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    },
    function () {
      alert('could not get your position');
    }
  );
}

// when we hit enter it will also trigger the sumbit on that form
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const { lat, lng } = mapEvent.latlng;

  let userInsertedValues = [];

  // clearing the form fields when submiting
  inputValues.forEach(input => {
    userInsertedValues.push(input.value);
    input.value = '';
  });

  // Display the marker
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxwidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent(`Workout with Distance ${userInsertedValues[0]}`)
    .openPopup();
});

// i want when selecting a cycling  cadence to hide and elevation to appear.

inputType.addEventListener('change', function () {
  // closest is like an inversed query selector so it selects parents and not children
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
