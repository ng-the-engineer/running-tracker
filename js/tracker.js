const latLngHarrow = [51.58066, -0.33780];

let map = L.map("tracker").setView(latLngHarrow, 15);



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
const latlngs = [
  [51.58091697930333,  -0.3427139735019594],
  [51.58091752060129,  -0.3427032079732662],
  [51.580917710795674,  -0.34270147246117333],
  [51.58100480796873,  -0.3426585760509962],
  [51.58120191759339,  -0.34271381111195026],
]
let path = L.polyline(latlngs, {
  color: 'red', 
  bubblingMouseEvents: true
}).addTo(map);

// zoom the map to the polyline
map.fitBounds(path.getBounds());


// ----------------------------------------------------------------
// Detect
// ----------------------------------------------------------------
const messageConsole = document.querySelector('#message-console');
const options = {
  enableHighAccuracy: false,
  maximumAge: 1000,
  timeout: 1000
};

if(!navigator.geolocation) {
  messageConsole.textContent = 'Geolocation is not supported by your browser';
} else {
  messageConsole.textContent = 'Locating ...';
  navigator.geolocation.watchPosition(success, error, options);
}

document.querySelector("#message-console")

  .addEventListener("GEO_EVENT", (event) => {
    const { latitude, longitude, timestamp } = event.detail;
    report(`2. Received event | latitude: ${latitude} | longitude: ${longitude} | timestamp: ${timestamp}`);

    path._latlngs.push([latitude, longitude]);
    path.redraw();
    report('3. Updated path');
});

function success(position) {
  const { latitude, longitude } = position.coords;
  const timestamp = (new Date(Date.now())).toISOString();

  report( `1. Detected at ${timestamp} | ${latitude}, ${longitude}`);

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

function error(err) {
  report(`Unable to retrieve your location! ${err.code} - ${err.message}`)
}

const report = (message) => {
  console.log(message);
  messageConsole.textContent += `\n ${message}`;
}