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
  type = 'running';
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
  type = 'cycling';
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
  #workoutList = [];
  constructor() {
    this._getPosition();
    // the event listeners that we want to be ready when our app starts
    // can be placed inside the constructor cause its the first thing that will run
    // when our instance is created.

    //experimenting to get the data from the form when submitting and creating a new object depending
    // on the type of the excercise
    // form.addEventListener('submit', function () {
    //   let values = [];
    //   // it will load all the values of the correspoing html fields
    //   inputValues.forEach(input => {
    //     values.push(input.value);
    //   });

    //   console.log(values);
    //   // the first entry in the array is the type of excercise
    //   if (values[0] === 'cycling') {
    //     // create a new instance of Cycling class
    //     let cyclingObj = new Cycling(
    //       [23, -44],
    //       values[1],
    //       values[2],
    //       values[4]
    //     );
    //     console.log(cyclingObj);
    //   } else if (values[0] === 'running') {
    //     // create a new instance of Running class
    //     let runningObj = new Running(
    //       [23, -44],
    //       values[1],
    //       values[2],
    //       values[3]
    //     );
    //     console.log(runningObj);
    //   }
    // });
    // we we submit the data from the form we want a new workout to be created! and some other stuff
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
    const coords = [lat, lng];

    //create some helper function to do the validation with diffrent number of values
    const allAreNumbers = (...values) => {
      let result = values.every(value => Number.isFinite(value));
      return result;
    };

    const allPositive = (...values) => {
      let result = values.every(value => value > 0);
      return result;
    };

    // Get Data from the form

    const type = inputType.value;
    // converting the string directly to number by adding + at the beggining of the string
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    let cadence;
    let elevetionGain;
    let workout;
    // Check if data is valid

    if (type === 'running') {
      // validating data
      cadence = +inputCadence.value;
      // need to check if data that gets entered is a number and a positive number
      if (
        !allAreNumbers(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        alert('The values need to be a possitive number');
      }
    }

    if (type === 'cycling') {
      // validating data
      elevetionGain = +inputElevation.value;
      // need to check if data that gets entered is a number and a positive number
      if (
        !allAreNumbers(distance, duration, elevetionGain) ||
        !allPositive(distance, duration)
      ) {
        alert('The values need to be a possitive number');
      }
    }

    // if workout running, create running object
    if (type === 'running') {
      workout = new Running(coords, distance, duration, cadence);
      console.log(workout);
    }
    // if workout cycling, create cycling object
    if (type === 'cycling') {
      workout = new Cycling(coords, distance, duration, elevetionGain);
      console.log(workout);
    }

    // Add the new created object to workout array
    this.#workoutList.push(workout);

    this._renderWorkOutMarker(workout);

    // show the work out list on the page

    this._renderWorkOut(workout);

    // clearing the form fields when submiting
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
  }

  _renderWorkOutMarker(workout) {
    //Render workout on map as marker
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxwidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`Workout `)
      .openPopup();
  }

  _renderWorkOut(workout) {
    //
  }
}

const app = new App();
