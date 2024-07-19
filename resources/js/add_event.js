function toggleDisplayPrices() {
  const freeEventCheckbox = document.getElementById("is_free");
  const addPricesBtn = document.getElementById("add-prices-btn");
  const pricesSection = document.getElementById("prices-section");

  if (freeEventCheckbox.checked){
    addPricesBtn.style.display = "none";
    pricesSection.classList.add("hidden")
    pricesSection.classList.remove("flex")

  } else {
    addPricesBtn.style.display = "flex";
    pricesSection.classList.add("flex")
    pricesSection.classList.remove("hidden")

  }
}

function toggleEditDisplayPrices() {
  const freeEventCheckbox = document.getElementById("is_free");
  const pricesSection = document.getElementById("prices-section-edit");

  if (freeEventCheckbox.checked){
    pricesSection.style.display = "none";
  } else {
    pricesSection.style.display = "flex";
  }
}

let priceElementCount = 0;
const maxElements = 5;

function addPriceFields(eventPrices) {
  const totalPrices = eventPrices + priceElementCount
  console.log('total: ', totalPrices);
  if (totalPrices < maxElements) {
    let template = document.getElementById('priceFieldsTemplate')
    let clone = document.importNode(template.content, true)
  
    const newIndex = document.querySelectorAll('.price-section').length
  
    // Update input names to include the new index
    const inputs = clone.querySelectorAll('input, textarea')
    inputs.forEach((input) => {
      const nameAttr = input.getAttribute('name')
      if (nameAttr) {
        input.setAttribute('name', nameAttr.replace(/\[0\]/g, `[${newIndex}]`))
        input.setAttribute('id', nameAttr.replace(/\[0\]/g, `[${newIndex}]`))
      }
    })
  
    document.getElementById('priceFieldsContainer').appendChild(clone)
    priceElementCount++
  } else {
    alert(`You have reached the limit of ${maxElements} elements.`);
  }
}

function deleteCurrentPriceElm(button) {
  if (priceElementCount > 0) {
    const fieldset = button.closest('fieldset.price-section');
    if (fieldset) {
        fieldset.remove();
        priceElementCount--;
    }
  }
}

function addDiscountedPriceFields() {
  let template = document.getElementById('discountedPriceFieldsTemplate')
  let clone = document.importNode(template.content, true)
  document.getElementById('discountedPriceFieldsContainer').appendChild(clone)
}

function toggleRowDiscountedPrice(element) {
  const priceSection = element.closest('.price-section')
  const rowDiscountedPrice = priceSection.querySelector('.discounted-row')
  const priceCategInput = priceSection.querySelector('#price_description')
  const regPriceInput = priceSection.querySelector('#regular_price')

  if (rowDiscountedPrice.classList.contains('hidden')) {
    rowDiscountedPrice.classList.remove('hidden')
    // priceCategInput.setAttribute('disabled', true);
    // regPriceInput.setAttribute('disabled', true);
  } else {
    rowDiscountedPrice.classList.add('hidden')
    // priceCategInput.removeAttribute('disabled');
    // regPriceInput.removeAttribute('disabled');
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
  console.log(categoryFieldsets)
  categoryFieldsets.forEach((fieldset) => {
    fieldset.id === 'categoryTypesFieldset_' + categoryId
      ? fieldset.classList.remove('hidden')
      : fieldset.classList.add('hidden')
  })

  const checkboxes = document.querySelectorAll('[name="categoryTypes[]"]')

  // TODO check what is needed here
  checkboxes.forEach((checkbox) => {
    const anyCategoryChecked = Array.from(document.querySelectorAll('[name="categories[]"]')).some(
      (checkedBox) => checkedBox.checked
    )
    checkbox.checked = false
    if (!anyCategoryChecked) {
      categoryFieldset.classList.add('hidden')
    }
  })
}

function previewImages(mediaLength=0) {
  // mediaLength is used when editing the event only
  // we set a default value so it can work while creating the event too
  const previewContainer = document.getElementById('imagePreviewContainer')
  const files = document.getElementById('images_link').files
  previewContainer.innerHTML = ''

  const maxFiles = 3

  if (files.length > maxFiles || files.length + mediaLength > maxFiles) {
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
