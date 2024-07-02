// Bruxelles
// let [latitude, longitude] = [50.85045, 4.34878]
let [latitude, longitude] = [50.645138, 5.57342]
let mapZoom = 13
let circle
// const latitude = 50.645138 // Remplacez par les coordonnées réelles
// const longitude = 5.57342 // Remplacez par les coordonnées réelles
let map = L.map('map')
const poi = [
  { name: 'POI 1', lat: 50.647, lng: 5.575 },
  { name: 'POI 2', lat: 50.64, lng: 5.57 },
  // Ajoutez d'autres POIs ici
]

const cityInput = document.getElementById('city-chosen')
const sliderInput = document.getElementById('slider-input')
const sliderThumb = document.getElementById('slider-thumb')
const progressBar = document.getElementById('progress-bar')
const inputRadius = document.getElementById('chosen-radius')
const sliderValue = document.getElementById('slider-value').children[0]
sliderInput.addEventListener('input', updateSlider)
// const map = L.map('map').setView([latitude, longitude], 13)

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution:
//     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map)

setTimeout(function () {
  map.invalidateSize() // Redimensionne la carte après un léger délai
}, 500)

poi.forEach(function (point) {
  L.marker([point.lat, point.lng]).addTo(map).bindPopup(point.name)
})

let baseRadius = sliderInput.value * 1000
// let circle = L.circle([latitude, longitude], {
//   color: 'rgb(234 179 8)',
//   fillColor: 'rgb(234 179 8)',
//   fillOpacity: 0.2,
//   radius: baseRadius,
// }).addTo(map)

sliderInput.addEventListener('change', () => {
  inputRadius.value = sliderInput.value
})

function updateSlider() {
  const value = sliderInput.value
  const max = sliderInput.max
  const percentage = ((value - sliderInput.min) / (max - sliderInput.min)) * 100

  sliderThumb.style.left = `calc(${percentage}% - 8px)`
  progressBar.style.width = percentage + '%'
  sliderValue.textContent = value

  updateCircleRadius(value * 1000)
  displayPOIsWithinRadius(latitude, longitude, value)
  updateMapZoom(value) // Ajoutez cette ligne pour mettre à jour le zoom de la carte
}

function updateCircleRadius(newRadius) {
  circle.setRadius(newRadius)
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

// Fonction pour afficher les POI dans un rayon défini autour de la Place Saint-Lambert
function displayPOIsWithinRadius(centerLat, centerLng, radiusKm) {
  let poiList = document.getElementById('poi-list')
  poiList.innerHTML =
    '<h3 class="font-bold">Points d\'intérêt dans un rayon de ' +
    radiusKm +
    ' km autour de la Place Saint-Lambert :</h3>'
  let ul = document.createElement('ul')

  poi.forEach(function (point) {
    let distance = getDistance(centerLat, centerLng, point.lat, point.lng)
    if (distance <= radiusKm) {
      let li = document.createElement('li')
      li.textContent = point.name + ' (' + distance.toFixed(2) + ' km)'
      ul.appendChild(li)
    }
  })

  poiList.appendChild(ul)
}

export function createMap(lat, long) {
  map.setView([lat, long], mapZoom)

  // Ajouter les tuiles OSM
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  circle = L.circle([lat, long], {
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

async function getEvents() {
  try {
    const response = await fetch('/api/getEvents')
    const events = await response.json()
    createPois(events)
    displayPOIsWithinRadius(latitude, longitude, baseRadius / 1000)
    console.log(events)
  } catch (error) {
    console.log(error)
  }
}

createMap(latitude, longitude)

function updateMapZoom(radiusKm) {
  let zoomLevel
  if (radiusKm <= 1) {
    zoomLevel = 13
  } else if (radiusKm <= 5) {
    zoomLevel = 12
  } else if (radiusKm <= 10) {
    zoomLevel = 11
  } else if (radiusKm <= 20) {
    zoomLevel = 10
  } else {
    zoomLevel = 9
  }
  map.setView([latitude, longitude], zoomLevel)
}

// Initialize the slider position and value
updateSlider()
