document.addEventListener('DOMContentLoaded', function () {
  const buttonMap = document.getElementById('button-map');
  const mapPopup = document.getElementById('map-popup');

  buttonMap.addEventListener('click', function () {
    mapPopup.classList.remove('hidden');

  });

  document.addEventListener('click', function (event) {
    const isClickInside = buttonMap.contains(event.target) || mapPopup.contains(event.target);
    if (!isClickInside) {
      mapPopup.classList.add('hidden');
    }
  });
});