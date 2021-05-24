let map = L.map("tracker").setView([51.505, -0.09], 13); // London center
let isPause = false;
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


// Init lines
let path;
// let path = L.polyline([
//   [51.58091697930333,  -0.3427139735019594],
//   // [51.58086428128717,  -0.3427745343867612]
// ], {
//   color: 'red', 
//   bubblingMouseEvents: true
// }).addTo(map);


// ----------------------------------------------------------------
// Detect
// ----------------------------------------------------------------
const messageConsole = document.querySelector('#message-console');
const options = {
  enableHighAccuracy: false,
  maximumAge: 1000,
  timeout: 1000
};

const startTracking = () => {
  if(!navigator.geolocation) {
    messageConsole.textContent = 'Geolocation is not supported by your browser';
  } else {
    messageConsole.textContent = 'Locating ...';

    path = L.polyline([
        [51.58091697930333,  -0.3427139735019594],
        // [51.58086428128717,  -0.3427745343867612]
      ], {
        color: 'red', 
        bubblingMouseEvents: true
      }).addTo(map);

    navigator.geolocation.watchPosition(success, error, options);
  }
}

const stopTracking = () => {
  path._latlngs =[];
  path.redraw();
}

const pauseTracking = () => {
  isPause = !isPause;
}

document.querySelector("#message-console")

  .addEventListener("GEO_EVENT", (event) => {

    const { latitude, longitude, timestamp } = event.detail;
    report(`2. Received event | latitude: ${latitude} | longitude: ${longitude} | timestamp: ${timestamp}`);

    console.log('path._latlngs=', path._latlngs.length)
    if(path._latlngs.length <= 2) {    
      // map.setView([latitude, longitude], 15)
    }
    
    if (isPause === false) { 
      
      path._latlngs.push([latitude, longitude]);
      // console.log('points:', path._latlngs);
      path.redraw();
      map.fitBounds(path.getBounds());
      
      report('3. Updated path');
    }
});

function success(position) {
  const { latitude, longitude } = position.coords;
  const timestamp = (new Date(Date.now())).toISOString();

  report( `1. Detected at ${timestamp} | ${latitude}, ${longitude}`);

  createNewEvent(latitude, longitude, timestamp);
}

function error(err) {
  report(`Unable to retrieve your location! ${err.code} - ${err.message}`)
}

const report = (message) => {
  console.log(message);
  messageConsole.textContent += `\n ${message}`;
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

  document.querySelector("#message-console").dispatchEvent(geoEvent);
}