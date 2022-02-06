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

let inputValues = [
  inputType,
  inputDistance,
  inputDuration,
  inputCadence,
  inputElevation,
];
// when a global variable gets changeδ in a function the changes are vissible everywhere
// let mapEvent, map;

class Workout {
  date = new Date();
  // create a unique id for each object
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    // instead of having this in the constructor we can use the modern js to add them in the class
    // this.date = new Date()
    // this.id = ...
    this.coords = coords; //[lat,lng]
    this.distance = distance; // in Km
    this.duration = duration; // in Minutes
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevetionGain) {
    super(coords, distance, duration);
    this.elevetionGain = elevetionGain;

    this.calcSpeed();
  }

  calcSpeed() {
    // km/hour
    // when calcSpeed Method is called as the calcPace above it will add
    // the speed property to our class and it gets done automatically
    // because it gets calculated on object creation
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

/////////////////////////////////////////////
// APPLICATION ARCHITECTURE
class App {
  // private properties of the class
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    // the event listeners that we want to be ready when our app starts
    // can be placed inside the constructor cause its the first thing that will run
    // when our instance is created.

    //experimenting to get the data from the form when submitting and creating a new object depending
    // on the type of the excercise
    form.addEventListener('submit', function () {
      let values = [];
      // it will load all the values of the correspoing html fields
      inputValues.forEach(input => {
        values.push(input.value);
      });

      console.log(values);
      // the first entry in the array is the type of excercise
      if (values[0] === 'cycling') {
        // create a new instance of Cycling class
        let cyclingObj = new Cycling(
          [23, -44],
          values[1],
          values[2],
          values[4]
        );
        console.log(cyclingObj);
      } else if (values[0] === 'running') {
        // create a new instance of Running class
        let runningObj = new Running(
          [23, -44],
          values[1],
          values[2],
          values[3]
        );
        console.log(runningObj);
      }
    });

    form.addEventListener('submit', this._newWorkout.bind(this));
    // i want when selecting a cycling  cadence to hide and elevation to appear.
    // binding this here it wont change anything cause we dont use this in the method but its nice to have
    // if we add extra functionality
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  // getPosition class the _loadMap if gets a success on getting the location
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('could not get your position');
        }
      );
    }
  }

  // where load map is loaded on the getPositon method on success,
  //
  _loadMap(position) {
    console.log(position);
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    let coordinates = [latitude, longitude];

    // L.map('gets an id of an html element')

    this.#map = L.map('map').setView(coordinates, 13);

    // creating the tile
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // we want on click to create a marker on the map depending on that click
    // so we call the map.on function that responds on clicks and calls a callbakc functions that gives us, as a parameter the map event
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    // closest is like an inversed query selector so it selects parents and not children
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(event) {
    event.preventDefault();
    const { lat, lng } = this.#mapEvent.latlng;
    let userInsertedValues = [];

    // Get Data from the form

    // Check if data is valid

    // if workout running, create running object

    // if workout cycling, create cycling object

    // Add the new created object to workout array

    //Render workout on map as marker
    L.marker([lat, lng])
      .addTo(this.#map)
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

    // clearing the form fields when submiting
    inputValues.forEach(input => {
      userInsertedValues.push(input.value);
      input.value = '';
    });
  }
}

// if navigator.geolocation exists

// when we hit enter it will also trigger the sumbit on that form

const app = new App();
