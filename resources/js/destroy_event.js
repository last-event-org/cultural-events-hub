const destroyForms = document.getElementsByName('destroy')
const removeEventModal = document.getElementById('remove_event')
const cancelButton = document.getElementById('cancel')
const confirmButton = document.getElementById('confirm')
const closeButton = document.getElementById('close')
const eventSpan = document.getElementById('event-name')

destroyForms.forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    removeEventModal.classList.remove('hidden')
    const eventName = e.target.getAttribute('data-event-name')
    eventSpan.innerText = eventName
    cancelButtonEvent()
    closeButtonEvent()
    confirmButtonEvent(e)
  })
})

function cancelButtonEvent() {
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeEventModal.classList.add('hidden')
  })
}

function closeButtonEvent() {
  closeButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeEventModal.classList.add('hidden')
  })
}

function confirmButtonEvent(form) {
  confirmButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    removeEventModal.classList.add('hidden')
    form.target.submit()
  })
}
