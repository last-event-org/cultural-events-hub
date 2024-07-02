let mapZoom = 13

let poi = []
let poiWithinRadius = []
let baseRadius = 1000
const radiusButtons = document.querySelectorAll('.radius-btn')
const city = window.city

// Bruxelles
let [latitude, longitude] = [50.85045, 4.34878]
// Initialiser la carte centrée sur Liège
// if (window.city) {
//   ;[latitude, longitude] = await getCoordinatesFromCity(window.city)
//   console.log(latitude + '  ' + longitude)
// }
let map
let circle

function createMap(lat, long) {
  map = L.map('map').setView([lat, long], mapZoom)

  // Ajouter les tuiles OSM
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  circle = L.circle([latitude, longitude], {
    // color: 'blue',
    // fillColor: '#30f',
    color: 'rgb(234 179 8)',
    fillColor: 'rgb(234 179 8)',
    fillOpacity: 0.2,
    radius: baseRadius,
    // Rayon en mètres, variable à changer pour augmenter
    // le taille du cercle mais il faut aussi changer l'appel
    // de la fonction displayPOIsWithinRadius
    // pour récupérer les POI
  }).addTo(map)
}

// // Points d'intêrets "en dur"
// let poi = []
// // events.forEach((event) => {
// //   console.log(event.location)
// // })

function createPois(events) {
  console.log('createPois')
  events.forEach(function (event) {
    poi.push({
      id: event.id,
      title: event.title,
      lat: event.location.latitude,
      lng: event.location.longitude,
      location: event.location.name,
    })
    L.marker([event.location.latitude, event.location.longitude]).addTo(map).bindPopup(event.title)
  })
}

// // Ajouter un cercle bleu transparent autour de la Place Saint-Lambert

radiusButtons.forEach((button) => {
  button.addEventListener('click', () => {
    baseRadius = button.value
    mapZoom = button.dataset.zoom
    updateCircleRadius(baseRadius)
    updateMapZoom(mapZoom)
    displayPOIsWithinRadius(latitude, longitude, baseRadius / 1000)
  })
})

function updateCircleRadius(newRadius) {
  circle.setRadius(newRadius)
  baseRadius = newRadius
}

function updateMapZoom(newZoom) {
  map.setZoom(newZoom)
}

// Fonction pour calculer la distance entre deux points (en km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Rayon de la Terre en km
  let dLat = ((lat2 - lat1) * Math.PI) / 180
  let dLon = ((lon2 - lon1) * Math.PI) / 180
  let a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2

  return R * 2 * Math.asin(Math.sqrt(a))
}

// Fonction pour afficher les POI dans un rayon de 1 km autour de la Place Saint-Lambert
function displayPOIsWithinRadius(centerLat, centerLng, radiusKm) {
  console.log('displayPOIsWithinRadius')
  poiWithinRadius = []
  let poiList = document.getElementById('poi-list')
  poiList.innerHTML =
    `<h3 class="font-bold">Points d\'intérêt dans un rayon de ` +
    radiusKm +
    ` km autour de ${city} :</h3>`
  let ul = document.createElement('ul')
  console.log(poi)
  poi.forEach(function (point) {
    let distance = getDistance(centerLat, centerLng, point.lat, point.lng)
    if (distance <= radiusKm) {
      let li = document.createElement('li')
      poiWithinRadius.push(point.id)
      li.textContent = point.title + ' ' + point.location + ' (' + distance.toFixed(2) + ' km)'
      ul.appendChild(li)
    }
  })

  console.log(poiWithinRadius)
  poiList.appendChild(ul)
}
//(latitude,longitude, rayon en km)

function displayEvents(point) {}

// console.log(window.city)
export async function getCoordinatesFromCity(city) {
  console.log('getCoordinatesFromCity')
  console.log(city)
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search/structured?api_key=5b3ce3597851110001cf6248e6f493bff36c4d3d8d3bc2062e801a41&country=belgium&locality=${city}&boundary.country=BE`
    )
    const datas = await response.json()
    return [datas.features[0].geometry.coordinates[1], datas.features[0].geometry.coordinates[0]]
  } catch (e) {
    console.log('ERROR OPENROUTE')
    console.log(e)
  }
}

function newfunction() {
  console.log(city)
  async function test() {
    try {
      const response = await fetch('/api/getEvents')
      const events = await response.json()
      ;[latitude, longitude] = await getCoordinatesFromCity(window.city)
      createMap(latitude, longitude)
      createPois(events)
      displayPOIsWithinRadius(latitude, longitude, baseRadius / 1000)

      console.log(events)
    } catch (error) {
      console.log(error)
    }
  }
  test()
}

newfunction()
