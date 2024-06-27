// var map = L.map('map').setView([51.505, -0.09], 13);
let map = L.map('map').setView([50.58362, 5.50115], 14)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)

L.marker([50.58362, 5.50115]).addTo(map).bindPopup("L'évènement est ici").openPopup()

console.log(latitude)
console.log(longitude)
