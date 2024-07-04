import { getCoordinatesFromCity } from '../geolocation'
import { createMap } from '../map_home'
console.log('dropdown cities')
//drop-down city list
const section = document.getElementById('big-search-bar-container')
const cityInput = document.getElementById('city-chosen')
const buttonCity = document.getElementById('button-city')
const cityList = document.getElementById('city-list')
const mapPopup = document.getElementById('chosen-radius')
const sliderInput = document.getElementById('slider-input')

cityInput.addEventListener('focus', (e) => {
  cityList.classList.remove('hidden')
})

document.addEventListener('DOMContentLoaded', () => {
  eventListenerOnList()

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
  const [latitude, longitude] = await getCoordinatesFromCity(city)
  console.log(latitude + ' - ' + longitude)
  createMap(latitude, longitude)
  mapPopup.focus()
  mapPopup.value = sliderInput.value
}

function eventListenerOnList() {
  console.log('eventlisteneronlist')
  const cities = document.getElementsByName('city')
  cities.forEach((city) => {
    city.addEventListener('click', (e) => {
      updateCity(e.target.value)
    })
  })
}


