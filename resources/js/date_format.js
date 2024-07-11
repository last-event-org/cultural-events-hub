function formatDate(startString, endString) {
  const date = new Date(startString)
  const endDate = new Date(endString)

  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ]

  const dayName = days[date.getUTCDay()]
  const day = date.getUTCDate()
  const month = months[date.getUTCMonth()]
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  const endDayName = days[endDate.getUTCDay()]
  const endDay = endDate.getUTCDate()
  const endMonth = months[endDate.getUTCMonth()]
  const endHours = endDate.getUTCHours()
  const endMinutes = endDate.getUTCMinutes()

  let formattedEnd = 0
  let formattedDate = 0
  const formattedTime = minutes > 0 ? `${hours}h${minutes}` : `${hours}h`

  if (endDay !== day) {
    formattedEnd =
      endMinutes > 0
        ? `${endDayName} ${endDay} ${endMonth}, ${endHours}h${endMinutes}`
        : `${endDayName} ${endDay} ${endMonth}, ${endHours}h`
    formattedDate = `Du ${dayName} ${day} ${month} ${formattedTime} au ${formattedEnd}`
  } else {
    formattedEnd = endMinutes > 0 ? ` ${endHours}h${endMinutes}` : `${endHours}h`
    formattedDate = `${dayName} ${day} ${month}, de ${formattedTime} à ${formattedEnd}`
  }

  return formattedDate
}

const dateElements = document.querySelectorAll('.formated-date')

dateElements.forEach(function (dateElement) {
  const eventStart = dateElement.getAttribute('data-event-start')
  const eventEnd = dateElement.getAttribute('data-event-end')
  const formattedDate = formatDate(eventStart, eventEnd)
  dateElement.textContent = formattedDate
})
