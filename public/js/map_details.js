// var map = L.map('map').setView([51.505, -0.09], 13);
let map = L.map('map').setView([window.latitude, window.longitude], 14)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)

let popup = L.popup().setContent(
  `<a href="/events/${window.id ?? ''}">${window.title}</a><br/>${window.locationname}`
)
let myIcon = L.icon({
  // className: `bg-${event.categoryTypes[0].category.slug} rounded-full m-2`,
  iconSize: [24, 24],
  iconUrl: `/svg/leaflet/${window.slug}.svg`,
})
L.marker([event.location.latitude, event.location.longitude], { icon: myIcon })
  .addTo(map)
  .bindPopup(popup)
