import { getCoordinatesFromCity } from './geolocation'

const sliderInput = document.getElementById('slider-input')
const sliderThumb = document.getElementById('slider-thumb')
const progressBar = document.getElementById('progress-bar')
const inputRadius = document.getElementById('chosen-radius')
const sliderValue = document.getElementById('slider-value').children[0]
const cityInput = document.getElementById('city-chosen')
const cityList = document.getElementById('city-list')
const buttonCity = document.getElementById('button-city')

// Bruxelles
// let [latitude, longitude] = [50.85045, 4.34878]
// Liège
let [latitude, longitude] = [50.645138, 5.57342]

let mapZoom = 10
let circle
let poi = []
let events
let map

sliderInput.addEventListener('input', updateSlider)

let baseRadius = sliderInput.value * 1000

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
  // displayPOIsWithinRadius(latitude, longitude, value)
  updateMapZoom(value) // Ajoutez cette ligne pour mettre à jour le zoom de la carte
}

function updateCircleRadius(newRadius) {
  circle.setRadius(newRadius)
}

async function createMap(lat = latitude, long = longitude, update = false) {
  if (update === false) {
    if (window.latitude) lat = window.latitude
    if (window.longitude) long = window.longitude
  }
  if (map === undefined) {
    map = L.map('map', {
      scrollWheelZoom: false, // Désactive le zoom par molette par défaut
    })
  }
  map.setView([lat, long], mapZoom)
  setTimeout(function () {
    map.invalidateSize() // Redimensionne la carte après un léger délai
  }, 500)

  // Ajouter les tuiles OSM
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)

  if (circle !== undefined) {
    circle.remove()
  }

  circle = L.circle([lat, long], {
    color: 'rgb(234 179 8)',
    fillColor: 'rgb(234 179 8)',
    fillOpacity: 0.2,
    radius: baseRadius,
    // Rayon en mètres, variable à changer pour augmenter
    // le taille du cercle mais il faut aussi changer l'appel
    // de la fonction displayPOIsWithinRadius
    // pour récupérer les POI
  }).addTo(map)
  await getEventsSearch(urlParams)
  createPois(events)
}

function createPois(eventsPoi) {
  console.log('createPois')
  eventsPoi.forEach((event) => {
    // poi.push({
    //   id: event.id,
    //   title: event.title,
    //   lat: event.location.latitude,
    //   lng: event.location.longitude,
    //   location: event.location.name,
    //   category: event.categoryTypes[0].category.slug,
    // })
    let popup = L.popup().setContent(
      `<a href="/events/${event?.id ?? ''}"'>${event.title}</a><br/>${event.location.name}`
    )
    let myIcon = L.icon({
      className: `bg-${event.categoryTypes[0].category.slug} rounded-full m-2`,
      iconSize: [24, 24],
      iconUrl: `/svg/categories/${event.categoryTypes[0].category.slug}.svg`,
    })
    L.marker([event.location.latitude, event.location.longitude], { icon: myIcon })
      .addTo(map)
      .bindPopup(popup)
  })
}

createMap(latitude, longitude)

document.addEventListener('DOMContentLoaded', () => {
  eventListenerOnList()
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('city') !== '') {
    cityInput.value = urlParams.get('city')
  }

  buttonCity.addEventListener('click', () => {
    cityList.classList.contains('hidden')
      ? cityList.classList.remove('hidden')
      : cityList.classList.add('hidden')
  })

  document.addEventListener('click', (event) => {
    const isClickInside = buttonCity.contains(event.target) || cityList.contains(event.target)
    if (!isClickInside) {
      cityList.classList.add('hidden')
    }
  })
})

async function updateCity(city) {
  cityInput.value = city
  ;[latitude, longitude] = await getCoordinatesFromCity(city)
  map.setView([latitude, longitude], mapZoom)
  await createMap(latitude, longitude, true)
}

function eventListenerOnList() {
  const cities = document.getElementsByName('city-list')
  cities.forEach((city) => {
    city.addEventListener('click', (e) => {
      updateCity(e.target.value)
    })
  })
}

async function getEventsSearch(params) {
  try {
    const response = await fetch(`/api/search?${params}`)
    events = await response.json()
  } catch (error) {
    console.log(error)
  }
}

function updateMapZoom(radiusKm) {
  let zoomLevel
  if (radiusKm <= 1) {
    zoomLevel = 13
  } else if (radiusKm <= 5) {
    zoomLevel = 12
  } else if (radiusKm <= 10) {
    zoomLevel = 11
  } else if (radiusKm <= 17) {
    zoomLevel = 10
  } else {
    zoomLevel = 9
  }
}

// Initialize the slider position and value
updateSlider()

// Fonction pour calculer la distance entre deux points (en km)
// function getDistance(lat1, lon1, lat2, lon2) {
//   const R = 6371 // Rayon de la Terre en km
//   let dLat = ((lat2 - lat1) * Math.PI) / 180
//   let dLon = ((lon2 - lon1) * Math.PI) / 180
//   let a =
//     0.5 -
//     Math.cos(dLat) / 2 +
//     (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2

//   return R * 2 * Math.asin(Math.sqrt(a))
// }

// Fonction pour afficher les POI dans un rayon défini autour de la Place Saint-Lambert
// function displayPOIsWithinRadius(centerLat, centerLng, radiusKm) {
//   let poiList = document.getElementById('poi-list')
//   poiList.innerHTML =
//     '<h3 class="font-bold">Points d\'intérêt dans un rayon de ' +
//     radiusKm +
//     ' km autour de la Place Saint-Lambert :</h3>'
//   let ul = document.createElement('ul')

//   poi.forEach(function (point) {
//     let distance = getDistance(centerLat, centerLng, point.lat, point.lng)
//     if (distance <= radiusKm) {
//       let li = document.createElement('li')
//       li.textContent = point.name + ' (' + distance.toFixed(2) + ' km)'
//       ul.appendChild(li)
//     }
//   })

//   poiList.appendChild(ul)
// }
