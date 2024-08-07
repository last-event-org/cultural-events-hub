document.addEventListener('DOMContentLoaded', function () {
  const datePicker = document.getElementById('date-picker')
  const prevButton = document.getElementById('prev-day')
  // const dateQuery = document.getElementById('date-query')
  const dateChosen = document.getElementById('date-chosen')
  const lang = document.documentElement.lang
  const nextButton = document.getElementById('next-day')
  const today = new Date()
  let selectedDate = new Date(today)
  let currentDate = new Date(today)

  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.size > 0) {
    const dateQuery = urlParams.get('date')
    if (dateQuery !== null) {
      if (dateQuery !== '') {
        formatDateInput(urlParams.get('date'))
        formatDateQuery(urlParams.get('date'))
        selectedDate = new Date(urlParams.get('date'))
      }
    }
  }

  function updateDatePicker() {
    datePicker.innerHTML = ''
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate)
      date.setDate(currentDate.getDate() + i)

      const month = date.toLocaleString(lang, { month: 'short' })
      const dayOfWeek = date.toLocaleString(lang, { weekday: 'short' })
      const dayOfMonth = date.getDate()

      const isSelected =
        date.toDateString() === selectedDate.toDateString()
          ? 'bg-indigo-300 shadow-lg light-shadow'
          : 'hover:bg-indigo-100 hover:shadow-lg hover-light-shadow'
      const isFontBold =
        date.toDateString() === selectedDate.toDateString() ? 'font-bold' : 'group-hover:font-bold'

      const dayElement = document.createElement('div')
      dayElement.className = `flex group ${isSelected} rounded-md mx-1 transition-all duration-300 cursor-pointer justify-center`
      dayElement.innerHTML = `
        <div class='flex items-center  px-4 py-1'>
          <div class='text-center '>
            <p class='${date.toDateString() === selectedDate.toDateString() ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-900'} text-xs font-semibold transition-all duration-300'>${dayOfWeek}</p>
            <p class='${date.toDateString() === selectedDate.toDateString() ? 'text-indigo-900' : 'text-slate-900 group-hover:text-indigo-900'} ${isFontBold} text-sm transition-all duration-300'>${dayOfMonth}</p>
            <p class='${date.toDateString() === selectedDate.toDateString() ? 'text-indigo-900' : 'text-slate-600 group-hover:text-indigo-900'} ${isFontBold} text-xs transition-all duration-300'>${month}</p>
          </div>
        </div>
        
      `
      dayElement.addEventListener('click', function () {
        formatDateInput(date)
        formatDateQuery(date)
        document.getElementById('calendar').classList.add('hidden')
        updateDatePicker()
      })
      datePicker.appendChild(dayElement)
    }
  }

  prevButton.addEventListener('click', function (e) {
    e.preventDefault()
    currentDate.setDate(currentDate.getDate() - 1)
    updateDatePicker()
  })

  nextButton.addEventListener('click', function (e) {
    e.preventDefault()
    currentDate.setDate(currentDate.getDate() + 1)
    updateDatePicker()
  })

  updateDatePicker()
})

function formatDateInput(date) {
  date = new Date(date)
  const inputDate = document.getElementById('date-chosen')
  inputDate.value =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '-' +
    (date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    date.getFullYear()
}

function formatDateQuery(date) {
  console.log('\n\n\nformatDateQuery\n\n\n')
  console.log(date)
  date = new Date(date)
  const queryDate = document.getElementById('date-query')
  queryDate.value =
    date.getFullYear() +
    '-' +
    (date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
}

//calendar
document.getElementById('button-date').addEventListener('click', function () {
  document.getElementById('calendar').classList.contains('hidden')
    ? document.getElementById('calendar').classList.remove('hidden')
    : document.getElementById('calendar').classList.add('hidden')
  document.getElementById('calendar').focus()
})

// Click out of the datepicker then close it
document.addEventListener('click', function (event) {
  const calendarButton = document.getElementById('button-date')
  const calendar = document.getElementById('calendar')
  const isClickInside = calendarButton.contains(event.target) || calendar.contains(event.target)

  if (!isClickInside) {
    calendar.classList.add('hidden')
  }
})
// To avoid close by clicking on the date picker
document.getElementById('calendar').addEventListener('click', function (event) {
  event.stopPropagation()
})
