const autoDetectResult = document.querySelector('#auto-detect-result');

const options = {
  enableHighAccuracy: false,
  maximumAge: 2000,
  timeout: 1000
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

  autoDetectResult.textContent += `\n ${(new Date(Date.now())).toISOString()}:  ${latitude},  ${longitude}` ;
}

function error(err) {
  console.log(typeof err);
  console.log(err)
  autoDetectResult.textContent = `Unable to retrieve your location! ${err.code} - ${err.message}`  ;
}
