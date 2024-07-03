console.log('GEOLOC')

var options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
}

function success(pos) {
  var crd = pos.coords

  console.log('Votre position actuelle est :')
  console.log(`Latitude : ${crd.latitude}`)
  console.log(`Longitude : ${crd.longitude}`)
  console.log(`La précision est de ${crd.accuracy} mètres.`)
}

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`)
  return (coord = '50.63373 5.56749')
}

// navigator.geolocation.getCurrentPosition(success, error, options)

export async function getCoordinatesFromAddress(address) {
  console.log('getCoordinatesFromAddress')
  console.log(address)
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search/structured?api_key=${import.meta.env.VITE_API_KEY_ROUTERSERVICE}&address=${street} ${number}&postalcode=${zip}&locality=${city}&boundary.country=BE`
    )
    const datas = await response.json()
    // latitude - longitude
    return [datas.features[0].geometry.coordinates[1], datas.features[0].geometry.coordinates[0]]
  } catch (e) {
    console.log('ERROR')
    console.log(e)
  }
}

export async function getCoordinatesFromCity(city) {
  console.log('getCoordinatesFromCity')
  console.log(city)
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search/structured?api_key=${import.meta.env.VITE_API_KEY_ROUTERSERVICE}&country=belgium&locality=${city}&boundary.country=BE`
    )
    const datas = await response.json()
    return [datas.features[0].geometry.coordinates[1], datas.features[0].geometry.coordinates[0]]
  } catch (e) {
    console.log('ERROR')
    console.log(e)
  }
}

// API KEY
// VITE_API_KEY_ROUTERSERVICE = 5b3ce3597851110001cf6248e6f493bff36c4d3d8d3bc2062e801a41

// API CALL to get the address based on a geoloc longitude/latitude
// https://api.openrouteservice.org /geocode/reverse? api_key = 5b3ce3597851110001cf6248e6f493bff36c4d3d8d3bc2062e801a41& point.lon = 50.63373& point.lat = 5.56749

// API CALL to get the coordinates based on an address
// https://api.openrouteservice.org/geocode/search/structured?api_key=5b3ce3597851110001cf6248e6f493bff36c4d3d8d3bc2062e801a41&address=pl%20xavier%20neujean%2024&postalcode=4000&locality=liege&boundary.country=BE

// API CALL to get cities based on autocompletion
// https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf6248e6f493bff36c4d3d8d3bc2062e801a41&text=Lie&boundary.country=BE
