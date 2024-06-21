
// Initialiser la carte centrée sur Liège
let map = L.map('map').setView([50.6333, 5.5667], 12);

// Ajouter les tuiles OSM
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Points d'intêrets "en dur"
let poi = [
    { "name": "Place Saint-Lambert", "lat": 50.6452, "lng": 5.5734 },
    { "name": "Gare de Liège-Guillemins", "lat": 50.6246, "lng": 5.5675 },
    { "name": "Montagne de Bueren", "lat": 50.6482, "lng": 5.5804 }
];

poi.forEach(function(point) {
    L.marker([point.lat, point.lng]).addTo(map)
        .bindPopup(point.name);
});

// Ajouter un cercle bleu transparent autour de la Place Saint-Lambert
let circle = L.circle([50.6452, 5.5734], {
    color: 'blue',
    fillColor: '#30f',
    fillOpacity: 0.2,
    radius: 2000  // Rayon en mètres, variable à changer pour augmenter 
                  // le taille du cercle mais il faut aussi changer l'appel 
                  // de la fonction displayPOIsWithinRadius 
                  // pour récupérer les POI
}).addTo(map);

// Fonction pour calculer la distance entre deux points (en km)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    let dLat = (lat2 - lat1) * Math.PI / 180;
    let dLon = (lon2 - lon1) * Math.PI / 180;
    let a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

// Fonction pour afficher les POI dans un rayon de 1 km autour de la Place Saint-Lambert
function displayPOIsWithinRadius(centerLat, centerLng, radiusKm) {
    let poiList = document.getElementById('poi-list');
    poiList.innerHTML = '<h3 class="font-bold">Points d\'intérêt dans un rayon de ' + radiusKm + ' km autour de la Place Saint-Lambert :</h3>';
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
//(latitude,longitude, rayon en km)
displayPOIsWithinRadius(50.6452, 5.5734, 2); 

