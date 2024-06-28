document.addEventListener('DOMContentLoaded', function() {
  const latitude = 50.645138;  // Remplacez par les coordonnées réelles
  const longitude = 5.573420;  // Remplacez par les coordonnées réelles
  const poi = [
    { name: "POI 1", lat: 50.647, lng: 5.575 },
    { name: "POI 2", lat: 50.640, lng: 5.570 },
    // Ajoutez d'autres POIs ici
  ];

  const sliderInput = document.getElementById('slider-input');
  const sliderThumb = document.getElementById('slider-thumb');
  const progressBar = document.getElementById('progress-bar');
  const sliderValue = document.getElementById('slider-value').children[0];

  const map = L.map('map').setView([latitude, longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  poi.forEach(function(point) {
    L.marker([point.lat, point.lng]).addTo(map).bindPopup(point.name);
  });

  let baseRadius = sliderInput.value * 1000;
  let circle = L.circle([latitude, longitude], {
    color: 'rgb(234 179 8)',
    fillColor: 'rgb(234 179 8)',
    fillOpacity: 0.2,
    radius: baseRadius
  }).addTo(map);

  function updateSlider() {
    const value = sliderInput.value;
    const max = sliderInput.max;
    const percentage = ((value - sliderInput.min) / (max - sliderInput.min)) * 100;

    sliderThumb.style.left = `calc(${percentage}% - 8px)`;
    progressBar.style.width = percentage + '%';
    sliderValue.textContent = value;

    updateCircleRadius(value * 1000);
    displayPOIsWithinRadius(latitude, longitude, value);
    updateMapZoom(value); // Ajoutez cette ligne pour mettre à jour le zoom de la carte
  }

  function updateCircleRadius(newRadius) {
    circle.setRadius(newRadius);
  }

  // Fonction pour calculer la distance entre deux points (en km)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    let dLat = ((lat2 - lat1) * Math.PI) / 180;
    let dLon = ((lon2 - lon1) * Math.PI) / 180;
    let a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * (1 - Math.cos(dLon))) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }

  // Fonction pour afficher les POI dans un rayon défini autour de la Place Saint-Lambert
  function displayPOIsWithinRadius(centerLat, centerLng, radiusKm) {
    let poiList = document.getElementById('poi-list');
    poiList.innerHTML =
      '<h3 class="font-bold">Points d\'intérêt dans un rayon de ' +
      radiusKm +
      ' km autour de la Place Saint-Lambert :</h3>';
    let ul = document.createElement('ul');

    poi.forEach(function(point) {
      let distance = getDistance(centerLat, centerLng, point.lat, point.lng);
      if (distance <= radiusKm) {
        let li = document.createElement('li');
        li.textContent = point.name + ' (' + distance.toFixed(2) + ' km)';
        ul.appendChild(li);
      }
    });

    poiList.appendChild(ul);
  }

  function updateMapZoom(radiusKm) {
    let zoomLevel;
    if (radiusKm <= 1) {
      zoomLevel = 13;
    } else if (radiusKm <= 5) {
      zoomLevel = 12;
    } else if (radiusKm <= 10) {
      zoomLevel = 11;
    } else if (radiusKm <= 20) {
      zoomLevel = 10;
    } else {
      zoomLevel = 9;
    }
    map.setView([latitude, longitude], zoomLevel);
  }

  sliderInput.addEventListener('input', updateSlider);

  // Initialize the slider position and value
  updateSlider();
});
