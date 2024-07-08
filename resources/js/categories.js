console.log('CATEGORIES SEARCH')
const urlParams = new URLSearchParams(window.location.search)
const categoriesLink = document.querySelectorAll('[data-category]')
const categoryTypesLink = document.querySelectorAll('[data-category-type]')
const searchForm = document.getElementById('BSB')

categoriesLink.forEach((category) => {
  category.addEventListener('click', (e) => {
    e.preventDefault()
    if (urlParams.get('categoryType')) urlParams.delete('categoryType')
    urlParams.set('category', e.target.getAttribute('data-category'))
    let currentHref = e.target.getAttribute('href')
    const newHref = `${currentHref}?` + urlParams
    window.location.href = newHref
  })
})

categoryTypesLink.forEach((categoryType) => {
  categoryType.addEventListener('click', (e) => {
    e.preventDefault()
    urlParams.set('categoryType', e.target.getAttribute('data-category-type'))
    let currentHref = e.target.getAttribute('href')
    const newHref = `${currentHref}?` + urlParams
    window.location.href = newHref
  })
})

searchForm.addEventListener('submit', (e) => {
  e.preventDefault()
  var actionUrl = e.target.action
  //   console.log(actionUrl)
  if (urlParams.get('categoryType')) urlParams.set('categoryType', urlParams.get('categoryType'))
  if (urlParams.get('category')) urlParams.set('category', urlParams.get('category'))
  //   console.log('URLPARAMS')
  //   console.log(urlParams)
  var params = new URLSearchParams(urlParams)
  //   params.set('newParam', 'newValue') // Set your new parameter key-value pair
  var updatedActionUrl = `${actionUrl}?${params.toString()}`
  //   console.log(updatedActionUrl)
  e.target.action = updatedActionUrl
  //   console.log(e.target.action)
  e.target.submit()
})
