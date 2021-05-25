const LONDON_CENTRE_LAT_LNG = [51.505, -0.09]
const HIGH_ACCURACY = true;
const LOW_ACCURACY = false;
const MAX_CACHE_AGE_MILLISECOND = 30000;
const MAX_NEW_POSITION_MILLISECOND = 5000;


let map = L.map("tracker").setView(LONDON_CENTRE_LAT_LNG, 13);
let isStart = null;
let path = null;

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1IjoibTQxaGlnaHdheSIsImEiOiJja295ZjQya2wwaTkxMnFtY203Z21wNjhzIn0.uF1S6TqlDfW7wmQ17Kp4NQ",
  }
).addTo(map);


// ----------------------------------------------------------------
// Detect
// ----------------------------------------------------------------
const logConsole = document.querySelector('#log-console');
const options = {
  enableHighAccuracy: HIGH_ACCURACY,
  maximumAge: MAX_CACHE_AGE_MILLISECOND,
  timeout: MAX_NEW_POSITION_MILLISECOND,
};

const startTracking = () => {
  if(!navigator.geolocation) {
    logConsole.textContent = 'Geolocation is not supported by your browser';
  } else {
    logConsole.textContent = 'Locating ...';

    return navigator.geolocation.watchPosition(success, error, options);
  }
}

const stopTracking = () => {
  path._latlngs =[];
  path.redraw();
}


document.querySelector("#tracker")
  .addEventListener("GEO_EVENT", (event) => {

    const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = event.detail;
    report(`2. Received lat: ${latitude} | lng: ${longitude} | accuracy: ${accuracy} | altitudeAccuracy ${altitudeAccuracy} | heading: ${heading} | speed: ${speed}`);

    // console.log('points = ', path._latlngs.length);
    // console.log('path.getBounds() =' , path.getBounds())

    if (path === null) {
      path = L.polyline([
        [ latitude, longitude ],
      ], {
        color: 'red', 
        bubblingMouseEvents: true
      }).addTo(map);

      map.setView([latitude, longitude], 15)
      map.fitBounds(path.getBounds());
    } else {

    // if(path._latlngs.length === 1) {    
      // map.setView([latitude, longitude], 15)
      // map.fitBounds(path.getBounds());
    //}
    
      if (isStart === true) { 

        path._latlngs.push([latitude, longitude]);
        path.redraw();
        // map.fitBounds(path.getBounds());
        
        report('3. Updated path');
      }
    }
});

function success(position) {
  const { latitude, longitude } = position.coords;
  const timestamp = (new Date(Date.now())).toISOString();

  report( `1. Detected at ${timestamp}`);

  createNewEvent(latitude, longitude, timestamp);
}

function error(err) {
  report(`Unable to retrieve your location! ${err.code} - ${err.message}`)
}

const report = (message) => {
  logConsole.innerHTML += `<br /> ${message}`;
}

const createNewEvent = (latitude, longitude, timestamp) => {
  
  const geoEvent = new CustomEvent("GEO_EVENT", {
    detail: {
      latitude,
      longitude,
      timestamp,
    },
    bubbles: true,
    cancelable: true,
    composed: false,
  });

  document.querySelector("#tracker").dispatchEvent(geoEvent);
}

const toggle = () => {

  if (isStart === null) {
    isStart = true;
    startTracking();
  } else {
    isStart = !isStart;
    console.log('isStart: ', isStart);
  }

}