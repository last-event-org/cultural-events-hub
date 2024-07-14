const forms = document.querySelectorAll('[data-form-modale]')
const textModale = document.querySelector('[data-form-object]')

const modale = document.getElementById('modale')
const cancelButton = document.getElementById('cancel')
const confirmButton = document.getElementById('confirm')
const closeButton = document.getElementById('close')

const textModaleAction = document.querySelector('[data-modale-action]')
const textModaleUser = document.querySelector('[data-modale-user]')

forms.forEach((form) => {
  form.addEventListener('submit', (e) => {
    console.log(e.target)
    e.preventDefault()
    cancelButtonEvent()
    closeButtonEvent()

    modale.classList.remove('hidden')
    const id = e.target.getAttribute('data-id')

    let object = document.querySelector(`[data-form-${id}]`)
    object = object.getAttribute('data-form-object')

    const formAction = e.target.getAttribute('data-form-action')
    console.log(formAction)

    textModaleAction.innerText = formAction
    textModaleUser.innerText = object

    confirmButtonEvent(e)
  })
})

function cancelButtonEvent() {
  cancelButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    modale.classList.add('hidden')
  })
}

function closeButtonEvent() {
  closeButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    modale.classList.add('hidden')
  })
}

function confirmButtonEvent(form) {
  confirmButton.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    modale.classList.add('hidden')
    form.target.submit()
  })
}
