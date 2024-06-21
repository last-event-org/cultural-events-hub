function addPriceFields() {
  let template = document.getElementById('priceFieldsTemplate')
  let clone = document.importNode(template.content, true)
  document.getElementById('priceFieldsContainer').appendChild(clone)
}

function addDiscountedPriceFields() {
  let template = document.getElementById('discountedPriceFieldsTemplate')
  let clone = document.importNode(template.content, true)
  document.getElementById('discountedPriceFieldsContainer').appendChild(clone)
}

function toggleRowDiscountedPrice() {
  const rowDiscountedPrice = document.getElementById('rowDiscountedPrices')
  if (rowDiscountedPrice.classList.contains('hidden')) {
    rowDiscountedPrice.classList.remove('hidden')
  } else {
    rowDiscountedPrice.classList.add('hidden')
  }
}

function toggleDiscountedPriceSection() {
  const discountedPriceSection = document.getElementById('discountedPriceSection')
  if (discountedPriceSection.classList.contains('hidden')) {
    discountedPriceSection.classList.remove('hidden')
  } else {
    discountedPriceSection.classList.add('hidden')
  }
}

// display Category Types only when parent Category is selected
function toggleCategoryTypes(categoryId) {
  console.log('ON CHANGE')

  // select all fieldset and hide
  const categoryFieldsets = document.querySelectorAll('[name="categoryTypesFieldset"]')
  categoryFieldsets.forEach((fieldset) => {
    fieldset.id === 'categoryTypesFieldset_' + categoryId
      ? fieldset.classList.remove('hidden')
      : fieldset.classList.add('hidden')
  })

  const checkboxes = document.querySelectorAll('[name="categoryTypes[]"]')

  // TODO check what is needed here
  checkboxes.forEach((checkbox) => {
    const anyCategoryChecked = Array.from(document.querySelectorAll('[name="categories[]"]')).some(
      (checkbox) => checkbox.checked
    )
    checkbox.checked = false
    if (!anyCategoryChecked) {
      categoryFieldset.classList.add('hidden')
    }
  })
}

function previewImages() {
  const previewContainer = document.getElementById('imagePreviewContainer')
  const files = document.getElementById('images_link').files
  previewContainer.innerHTML = ''

  const maxFiles = 3

  if (files.length > maxFiles) {
    alert(`Vous ne pouvez sélectionner que ${maxFiles} fichiers maximum.`)
    document.getElementById('images_link').value = '' // Clear the input to prevent submission with excess files
    return
  }

  if (files) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader()

      reader.onload = function (e) {
        const img = document.createElement('img')
        img.src = e.target.result
        img.alt = file.name
        img.classList.add('h-32', 'w-32', 'object-cover', 'm-2')
        previewContainer.appendChild(img)
      }

      reader.readAsDataURL(file)
    })
  }
}
