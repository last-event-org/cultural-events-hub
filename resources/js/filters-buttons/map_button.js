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
    console.log('EVENT')
    console.log(event.target)
    const isClickInside = buttonMap.contains(event.target) || mapPopup.contains(event.target)
    console.log()
    if (!isClickInside && !(document.activeElement === inputRadius)) {
      mapPopup.classList.add('hidden')
    }
  })

  inputRadius.addEventListener('focus', () => {
    mapPopup.classList.remove('hidden')
  })
})
