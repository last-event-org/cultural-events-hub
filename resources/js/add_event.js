

function addPriceFields() {
  
  let template = document.getElementById('priceFieldsTemplate');
  let clone = document.importNode(template.content, true);
  document.getElementById('priceFieldsContainer').appendChild(clone);
}



// display Category Types only when parent Category is selected
function toggleCategoryTypes(categoryId) {
  const categoryCheckbox = document.getElementById('category_' + categoryId);
  const checkboxes = document.querySelectorAll('.category-type-' + categoryId);
  const categoryFieldset = document.querySelector('#categoryTypesFieldset_' + categoryId);

  if (categoryCheckbox.checked) {
    checkboxes.forEach((checkbox) => {
      checkbox.classList.remove('hidden');
    });
    categoryFieldset.classList.remove('hidden');
  } else {
    checkboxes.forEach((checkbox) => {
      checkbox.classList.add('hidden');
    });

    // Check if any category checkbox is checked
    const anyCategoryChecked = Array.from(document.querySelectorAll('[name="categories[]"]')).some(checkbox => checkbox.checked);
    if (!anyCategoryChecked) {
      categoryFieldset.classList.add('hidden');
    }
  }
}