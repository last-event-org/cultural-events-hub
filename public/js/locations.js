const addresses = [
  { street: 'Pl. Xavier-Neujean', number: 24, zip: 4000, city: 'Liège' },
  { street: 'Rue Bruno', number: 12, zip: 5000, city: 'Namur' },
  { street: "Esplanade de l'Europe", number: 2, zip: 4020, city: 'Liège' },
  { street: 'Avenue Jean Mermoz', number: 50, zip: 6041, city: 'Charleroi' },
  { street: 'Place Reine Astrid', number: 3, zip: 5500, city: 'Dinant' },
  { street: 'Rue des Deux Provinces', number: 1, zip: 6900, city: 'Marche-en-Famenne' },
  { street: 'Rue des Carmes', number: 3, zip: 7500, city: 'Tournai' },
  { street: 'Place Raymond Lemaire', number: 1, zip: 1348, city: 'Louvain-la-Neuve' },
  { street: 'Rue Saint-Germain', number: 126, zip: 4500, city: 'Huy' },
  { street: 'Rue Renaud Strivay', number: 44, zip: 4100, city: 'Seraing' },
  { street: 'Rue de Behogne', number: 6, zip: 5580, city: 'Rochefort' },
  { street: 'Place Royale', number: 2, zip: 4900, city: 'Spa' },
  { street: 'Place Emile Vandervelde', number: 3, zip: 1348, city: 'Louvain-la-Neuve' },
  { street: 'Place Roi Baudouin', number: 1, zip: 6900, city: 'Marche-en-Famenne' },
  { street: 'Rue de Mulhouse', number: 36, zip: 4000, city: 'Liège' },
]

async function getAddressCoordinates(address) {
  console.log('TEST')
  const url = `https://api.openrouteservice.org/geocode/search/structured?api_key=5b3ce3597851110001cf6248e6f493bff36c4d3d8d3bc2062e801a41&address=${address.street} ${address.number}&postalcode=${address.zip}&locality=${address.city}&boundary.country=BE`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.features.length > 0) {
      return {
        lat: data.features[0].geometry.coordinates[1],
        lng: data.features[0].geometry.coordinates[0],
      }
    } else {
      console.error('No coordinates found for the given address.')
      return null
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error)
    return null
  }
}

addresses.forEach(async (address) => {
  const coords = await getAddressCoordinates(address)
  if (coords) {
    console.log(`Latitude and Longitude for ${address.street}:`, coords)
  }
})
