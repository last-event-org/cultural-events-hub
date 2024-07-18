import { DateTime } from 'luxon'
const lang = document.documentElement.lang

// Set default start and end date for the event
document.addEventListener('DOMContentLoaded', function () {
  // Set the desired event start date and time value (defaults to now())
  const date = DateTime.now()
  console.log(date)
  console.log('DATE')
  const startDate = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm")
  console.log('Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone)
  document.getElementById('timezone').value = Intl.DateTimeFormat().resolvedOptions().timeZone
  // Set the event end date and time values
  // + 2 hours
  const endDate = DateTime.now().plus({ hours: 2 }).toFormat("yyyy-MM-dd'T'HH:mm")
  // end_date.setHours(end_date.getHours())

  // Format the date to match the 'datetime-local' input format
  document.getElementById('event_start').value = startDate
  document.getElementById('event_end').value = endDate
})
