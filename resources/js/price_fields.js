function toggleFreeCategoryPrices(element) {
  const priceSection = element.closest('.price-section')
  const freeCategoryCheckbox = priceSection.querySelector(".free-category");
  const regPriceFld = priceSection.querySelector(".regular_price");
  const discPriceFld = priceSection.querySelector(".discounted_price");
  const becomeFreeFld = priceSection.querySelector(".become_free");

  if (freeCategoryCheckbox.checked) {
      regPriceFld.setAttribute("disabled", true)
      regPriceFld.classList.add("bg-slate-100")
      discPriceFld.setAttribute("disabled", true)
      discPriceFld.classList.add("bg-slate-100")
      becomeFreeFld.setAttribute("disabled", true)
      becomeFreeFld.classList.add("border-slate-100")
      if (becomeFreeFld.checked) {
        becomeFreeFld.checked = false;
      }
  } else {
      regPriceFld.removeAttribute("disabled")
      regPriceFld.classList.remove("bg-slate-100")
      discPriceFld.removeAttribute("disabled")
      discPriceFld.classList.remove("bg-slate-100")
      becomeFreeFld.removeAttribute("disabled")
      becomeFreeFld.classList.remove("border-slate-100")
  }

  
}

function becomeFreeCategory(element){
  const priceSection = element.closest('.price-section');
  const discPriceFld = priceSection.querySelector(".discounted_price");
  const becomeFreeFld = priceSection.querySelector(".become_free");

  if (becomeFreeFld.checked) {
    discPriceFld.setAttribute("disabled", true)
    discPriceFld.classList.add("bg-slate-100")
  } else{
    discPriceFld.removeAttribute("disabled")
    discPriceFld.classList.remove("bg-slate-100")
  }
}