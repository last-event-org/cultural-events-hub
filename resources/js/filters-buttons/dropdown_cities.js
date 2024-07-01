  //drop-down city list
  const section = document.getElementById('big-search-bar-container');
  document.addEventListener('DOMContentLoaded', function () {
    const buttonCity = document.getElementById('button-city');
    const cityList = document.getElementById('city-list');

    buttonCity.addEventListener('click', function () {
      cityList.classList.remove('hidden');

    });

    document.addEventListener('click', function (event) {
      const isClickInside = buttonCity.contains(event.target) || cityList.contains(event.target);
      if (!isClickInside) {
        cityList.classList.add('hidden');
      }
    });
  });