const autoDetectResult = document.querySelector('#auto-detect-result');

const options = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: 0
};

if(!navigator.geolocation) {
  autoDetectResult.textContent = 'Geolocation is not supported by your browser';
} else {
  autoDetectResult.textContent = 'Locating ...';
  navigator.geolocation.watchPosition(success, error, options);
}


function success(position) {
  console.log('success:', position.coords)
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;

  autoDetectResult.textContent += `\n ${(new Date(Date.now())).toISOString()}: ${latitude},${longitude}` ;
}

function error(err) {
  // console.log('err: ', JSON.stringify(err, null, 2))
  console.log(err.toString());
  // autoDetectResult.textContent = 'Unable to retrieve your location! ' + JSON.stringify(err, null, 2);
  autoDetectResult.textContent = 'Unable to retrieve your location! ' + err.toString();
}
