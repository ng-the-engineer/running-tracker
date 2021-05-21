const pollResult = document.querySelector('#poll-result');

function pollGeoLocation() {
  if(!navigator.geolocation) {
    pollResult.textContent = 'Geolocation is not supported by your browser'
  } else {
    pollResult.textContent = 'Locating ...';

    setInterval(() => { 
      navigator.geolocation.getCurrentPosition(success, error)
    }, 5000)
  }
}

function success(position) {
  console.log('success:', position.coords)
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  pollResult.textContent += `\n ${(new Date(Date.now())).toISOString()}: ${latitude},${longitude}` ;
}

function error() {
  pollResult.textContent = 'Unable to retrieve your location'
}

pollGeoLocation();