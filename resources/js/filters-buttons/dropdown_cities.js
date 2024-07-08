import { getCoordinatesFromCity } from '../geolocation'
import { createMap } from '../map_home'

const cityInput = document.getElementById('city-chosen')
const buttonCity = document.getElementById('button-city')
const cityList = document.getElementById('city-list')

document.addEventListener('DOMContentLoaded', () => {
  eventListenerOnList()
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('city') !== '') {
    cityInput.value = urlParams.get('city')
  }

  buttonCity.addEventListener('click', () => {
    console.log('click buttoncity')
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
  console.log('updateCity')
  cityInput.value = city
  // mapPopup.value = sliderInput.value
  const [latitude, longitude] = await getCoordinatesFromCity(city)
  await createMap(latitude, longitude)
}

function eventListenerOnList() {
  const cities = document.getElementsByName('city')
  cities.forEach((city) => {
    city.addEventListener('click', (e) => {
      updateCity(e.target.value)
    })
  })
}
