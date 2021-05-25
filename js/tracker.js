let map = L.map("tracker").setView(LONDON_CENTRE_LAT_LNG, 13);

// ----------------------------------------------------------------
// Config
// ----------------------------------------------------------------
const trackOptions = {
  enableHighAccuracy: HIGH_ACCURACY,
  maximumAge: MAX_CACHE_AGE_MILLISECOND,
  timeout: MAX_NEW_POSITION_MILLISECOND,
};

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


let isStart = null;
let path = null;
let accumulatedDistance = 0;

// ----------------------------------------------------------------
// Detect
// ----------------------------------------------------------------
const logConsole = document.querySelector('#log-console');


const startTracking = () => {
  if(!navigator.geolocation) {
    logConsole.textContent = 'Geolocation is not supported by your browser';
  } else {
    logConsole.textContent = 'Locating ...';

    return navigator.geolocation.watchPosition(success, error, trackOptions);
  }
}

// const stopTracking = () => {
//   path._latlngs =[];
//   path.redraw();
// }

document.querySelector("#tracker")
  .addEventListener("GEO_EVENT", (event) => {
    const { latitude, longitude, timestamp, accuracy, altitude, altitudeAccuracy, heading, speed } = event.detail;
    report(`2. Received lat: ${latitude} | lng: ${longitude} | accuracy: ${accuracy} | altitude: ${altitude} | altitudeAccuracy ${altitudeAccuracy} | heading: ${heading} | speed: ${speed}`);

    if (path === null) {
      path = L.polyline([
        [ latitude, longitude ],
      ], {
        color: '#fbc531', 
        bubblingMouseEvents: true
      }).addTo(map);

      map.setView([latitude, longitude], 15)
      map.fitBounds(path.getBounds());

      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`<b>Start at ${timestamp}</b>`);

    } else {
    
      if (isStart === true) { 

        path._latlngs.push([latitude, longitude]);
        path.redraw();

        const delta = calculateDelta(path._latlngs)
        accumulatedDistance =  delta + accumulatedDistance;

        report(`3. Updated path with ${delta} km | accumulatedDistance = ${accumulatedDistance}`);
      }
    }
});

const success = (position) => {
  const { latitude, longitude } = position.coords;
  const timestamp = (new Date(Date.now())).toISOString();

  report( `1. Detected at ${timestamp}`);

  createNewEvent(latitude, longitude, timestamp);
}

const error = (err) => report(`Unable to retrieve your location! ${err.code} - ${err.message}`);

const report = (message) => logConsole.innerHTML += `<br /> ${message}`;

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
  }
}

const calculateDelta = (track) => {
  // Ignore the first object in the path array
  if (track.length >= 3) {
    const newIndex = track.length - 1;
    const newLatLng = track[newIndex];
    const lastLatLng = track[newIndex - 1];
    const latitude = 0;
    const longitude = 1;
    return distance(newLatLng[latitude], newLatLng[longitude], lastLatLng[latitude], lastLatLng[longitude], 'K');
  } else {
    return 0;
  }
}