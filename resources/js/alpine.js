import Alpine from 'alpinejs'
window.Alpine = Alpine

function dataHandler() {
  console.log('dataHandler')
  return {
    data: null,
    async fetchData() {
      try {
        const response = await fetch('/api/getEvents')
        if (response.ok) {
          this.data = await response.json()
          console.log(this.data)
        } else {
          console.error('Error fetching data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },
  }
}

document.addEventListener('alpine:init', () => {
  Alpine.data('dataHandler', dataHandler)
})

dataHandler()

Alpine.start()
