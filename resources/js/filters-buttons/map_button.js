document.addEventListener('DOMContentLoaded', function () {
  const buttonMap = document.getElementById('button-map')
  const mapPopup = document.getElementById('map-popup')
  const inputRadius = document.getElementById('chosen-radius')

  buttonMap.addEventListener('click', () => {
    mapPopup.classList.contains('hidden')
      ? mapPopup.classList.remove('hidden')
      : mapPopup.classList.add('hidden')
  })

  document.addEventListener('click', (event) => {
    const isClickInside = buttonMap.contains(event.target) || mapPopup.contains(event.target)
    if (!isClickInside && !(document.activeElement === inputRadius)) {
      mapPopup.classList.add('hidden')
    }
  })
})
