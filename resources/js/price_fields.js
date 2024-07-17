function toggleFreeCategoriyPrices(element) {
    const priceSection = element.closest('.price-section')
    const freeCategoryCheckbox = priceSection.querySelector(".free-category");
    const regPriceFld = priceSection.querySelector(".regular_price");
    const discPriceFld = priceSection.querySelector(".discounted_price");
    const becomeFreeFld = priceSection.querySelector(".become_free");

    if (freeCategoryCheckbox.checked) {
        regPriceFld.setAttribute("disabled", true)
        discPriceFld.setAttribute("disabled", true)
        becomeFreeFld.setAttribute("disabled", true)
    } else {
        regPriceFld.removeAttribute("disabled")
        discPriceFld.removeAttribute("disabled")
        becomeFreeFld.removeAttribute("disabled")
    }
}

function toggleFreeLastMinutePrice(element) {
    const priceSection = element.closest('.price-section')
    const becomeFreeCheckbox = priceSection.querySelector(".become_free");
    const discPriceFld = priceSection.querySelector(".discounted_price");

    if (becomeFreeCheckbox.checked) {
        discPriceFld.setAttribute("disabled", true)
    } else {
        discPriceFld.removeAttribute("disabled")
    }
}