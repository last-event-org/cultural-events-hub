const sliderInput = document.getElementById('slider-input')
const sliderThumb = document.getElementById('slider-thumb')
const progressBar = document.getElementById('progress-bar')
const inputRadius = document.getElementById('chosen-radius')
const sliderValue = document.getElementById('slider-value').children[0]

// Bruxelles
// let [latitude, longitude] = [50.85045, 4.34878]
let [latitude, longitude] = [50.645138, 5.57342]
// let latitude = window.latitude === undefined ? window.latitude : 50.645138
// let longitude = window.longitude ? 2 : 5.57342

let mapZoom = 13
let circle
let poi = []
let events
let map = L.map('map')

console.log('MAP HOME LAT LONG')
console.log(latitude + '    ' + longitude)
console.log(window.latitude + '    ' + window.longitude)

sliderInput.addEventListener('input', updateSlider)

setTimeout(function () {
  map.invalidateSize() // Redimensionne la carte après un léger délai
}, 500)

// poi.forEach(function (point) {
//   L.marker([point.lat, point.lng]).addTo(map).bindPopup(point.name)
// })

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
  // displayPOIsWithinRadius(latitude, longitude, value)
  updateMapZoom(value) // Ajoutez cette ligne pour mettre à jour le zoom de la carte
}

function updateCircleRadius(newRadius) {
  circle.setRadius(newRadius)
}

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

export async function createMap() {
  // console.log('CREATE MAP')
  // console.log(lat + '   ' + long)
  if (window.latitude) latitude = window.latitude
  if (window.longitude) longitude = window.longitude
  // console.log(lat + '   ' + long)
  map.setView([latitude, longitude], mapZoom)

  // Ajouter les tuiles OSM
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map)
  // L.removelayer(circle)
  // L.circle().removeFrom(map)
  circle = L.circle([latitude, longitude], {
    color: 'rgb(234 179 8)',
    fillColor: 'rgb(234 179 8)',
    fillOpacity: 0.2,
    radius: baseRadius,
    // Rayon en mètres, variable à changer pour augmenter
    // le taille du cercle mais il faut aussi changer l'appel
    // de la fonction displayPOIsWithinRadius
    // pour récupérer les POI
  }).addTo(map)
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams)
  console.log('api/search?' + urlParams)
  for (const [key, value] of urlParams) {
    console.log(key + '  ' + value)
  }
  // await getEventsSearch(urlParams)
  await getAllEvents()
  // await getEvents()
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
      className: `bg-${event.categoryTypes[0].category.slug} w-12 h-12 rounded-full`,
      iconSize: [25, 25],
      iconUrl: `/svg/categories/${event.categoryTypes[0].category.slug}.svg`,
    })
    L.marker([event.location.latitude, event.location.longitude], { icon: myIcon })
      .addTo(map)
      .bindPopup(popup)
  })
}

async function getEvents() {
  try {
    const response = await fetch('/api/getEvents')
    events = await response.json()
    console.log(events)
  } catch (error) {
    console.log(error)
  }
}

async function getEventsSearch(params) {
  try {
    console.log('\n\ngetEventsSearch\n\n')
    console.log('\nRESPONSE\n\n')
    const response = await fetch(`/api/search?${params}`)
    console.log('\nRESPONSE\n\n')
    console.log(response)
    events = await response.json()
    console.log(events)
  } catch (error) {
    console.log(error)
  }
}

async function getAllEvents() {
  try {
    const response = await fetch('/api/getAllEvents')
    events = await response.json()
    console.log(events)
  } catch (error) {
    console.log(error)
  }
}

createMap(latitude, longitude)

function updateMapZoom(radiusKm) {
  console.log('updateMapZoom')
  console.log(longitude)
  console.log(latitude)

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
