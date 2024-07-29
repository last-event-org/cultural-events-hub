// var map = L.map('map').setView([51.505, -0.09], 13);
let map = L.map('map').setView([window.latitude, window.longitude], 14)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)

L.marker([window.latitude, window.longitude]).addTo(map).bindPopup(window.name).openPopup()
