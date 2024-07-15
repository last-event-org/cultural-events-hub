import { DateTime } from 'luxon'
const lang = document.documentElement.lang

function formatDate(startString, endString) {
  let startDateIso = new Date(startString)
  startDateIso = startDateIso.toISOString()
  let endDateIso = new Date(endString)
  endDateIso = endDateIso.toISOString()

  const longDateFrom = {
    en: 'From',
    fr: 'Du',
  }

  const longDateTo = {
    en: 'to',
    fr: 'au',
  }

  const shortDateFrom = {
    en: 'from',
    fr: 'de',
  }

  const shortDateTo = {
    en: 'to',
    fr: 'à',
  }

  const startDate = DateTime.fromISO(startDateIso).setLocale(lang)
  const endDate = DateTime.fromISO(endDateIso).setLocale(lang)

  const formattedTime =
    startDate.minute !== '00'
      ? `${startDate.toFormat("HH'h'mm")}`
      : `${startDate.toFormat("HH'h'")}`

  // Si pas de date de fin, on retourne la date de début avec l'année
  if (!endString) {
    return DateTime.fromISO(startString).setLocale(lang).toFormat("ccc dd LLLL yyyy', ' T")
  }

  let formattedDate

  if (endDate.day !== startDate.day || endDate.month !== startDate.month) {
    const formattedEnd =
      endDate.minute !== '00'
        ? `${endDate.toFormat("ccc dd LLLL yyyy', ' HH'h'mm")}`
        : `${endDate.toFormat("ccc dd LLLL yyyy', ' HH'h'")}`
    formattedDate = `${longDateFrom[lang]} ${startDate.toFormat('ccc dd LLLL')} ${formattedTime} ${longDateTo[lang]} ${formattedEnd}`
  } else {
    const formattedEnd =
      endDate.minute !== '00' ? `${endDate.toFormat("HH'h'mm")}` : `${endDate.toFormat("HH'h'")}`
    formattedDate = `${startDate.toFormat('ccc dd LLLL')}, ${shortDateFrom[lang]} ${formattedTime} ${shortDateTo[lang]} ${formattedEnd}`
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
