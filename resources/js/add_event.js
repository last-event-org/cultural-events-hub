function addNewPrice(event) {
  event.preventDefault(); // Prevent the default button action (posting the form)

  const divEle = document.getElementById("inputFields");
  const wrapper = document.createElement("div");

  const descriptionLabelFld = document.createElement("label");
  descriptionLabelFld.textContent = 'Description Prix'
  descriptionLabelFld.setAttribute("type", "text");
  descriptionLabelFld.setAttribute("placeholder", "0.00");
  descriptionLabelFld.classList.add("text-gray-600", "block")
  
  const descriptionInputFld = document.createElement("input");
  descriptionInputFld.setAttribute("type", "text")
  descriptionInputFld.classList.add("text-gray-600", "block", "mt-1", "px-4", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-slate-500", "focus:border-slate-700", "sm:text-sm");

  const regPriceLabelFld = document.createElement("label");
  regPriceLabelFld.textContent = 'Prix Plein'
  regPriceLabelFld.setAttribute("type", "text");
  regPriceLabelFld.setAttribute("placeholder", "0.00");
  regPriceLabelFld.classList.add("text-gray-600", "block")

  const regPriceInputFld = document.createElement("input");
  regPriceInputFld.setAttribute("type", "text")
  regPriceInputFld.classList.add("text-gray-600", "block", "mt-1", "px-4", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-slate-500", "focus:border-slate-700", "sm:text-sm");

  const discPriceLabelFld = document.createElement("label");
  discPriceLabelFld.textContent = 'Prix Réduit'
  discPriceLabelFld.setAttribute("type", "text");
  discPriceLabelFld.setAttribute("placeholder", "0.00");
  discPriceLabelFld.classList.add("text-gray-600", "block")

  const discPriceInputFld = document.createElement("input");
  discPriceInputFld.setAttribute("type", "text")
  discPriceInputFld.classList.add("text-gray-600", "block", "mt-1", "px-4", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-slate-500", "focus:border-slate-700", "sm:text-sm");

  const availQtyLabelFld = document.createElement("label");
  availQtyLabelFld.textContent = 'Places Disponibles'
  availQtyLabelFld.setAttribute("type", "text");
  availQtyLabelFld.setAttribute("placeholder", "0");
  availQtyLabelFld.classList.add("text-gray-600", "block")

  const availQtyInputFld = document.createElement("input");
  availQtyInputFld.setAttribute("type", "text")
  availQtyInputFld.classList.add("text-gray-600", "block", "mt-1", "px-4", "py-2", "border", "border-gray-300", "rounded-md", "shadow-sm", "focus:ring-slate-500", "focus:border-slate-700", "sm:text-sm");

  const hr = document.createElement("hr");

  wrapper.appendChild(hr);
  wrapper.appendChild(descriptionLabelFld);
  wrapper.appendChild(descriptionInputFld);
  wrapper.appendChild(regPriceLabelFld);
  wrapper.appendChild(regPriceInputFld);
  wrapper.appendChild(discPriceLabelFld);
  wrapper.appendChild(discPriceInputFld);
  wrapper.appendChild(availQtyLabelFld);
  wrapper.appendChild(availQtyInputFld);
  divEle.appendChild(wrapper);
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