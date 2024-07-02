//drop-down city list
const section = document.getElementById('big-search-bar-container')
const cityInput = document.getElementById('city-chosen')
const buttonCity = document.getElementById('button-city')
const cityList = document.getElementById('city-list')
const mapPopup = document.getElementById('chosen-radius')

cityInput.addEventListener('focus', (e) => {
  cityList.classList.remove('hidden')
})

document.addEventListener('DOMContentLoaded', () => {
  eventListenerOnList()

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

function updateCity(city) {
  cityInput.value = city
  mapPopup.focus()
}

function eventListenerOnList() {
  const cities = document.getElementsByName('city')
  cities.forEach((city) => {
    city.addEventListener('click', (e) => {
      updateCity(e.target.value)
    })
  })
}
