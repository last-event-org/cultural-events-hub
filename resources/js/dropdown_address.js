//DropDown Billing Adress

const billingAdressButton = document.getElementById('billing__adress--button');
const shippingAdressComponent = document.getElementById('shipping__adress--component');

billingAdressButton.addEventListener('click', () => {
  if (shippingAdressComponent.classList.contains('block')) {
      shippingAdressComponent.classList.replace('block', 'hidden');
      shippingAdressComponent.classList.replace('opacity-100', 'opacity-0');
      shippingAdressComponent.classList.replace('scale-100', 'scale-50');
    } else {
    shippingAdressComponent.classList.replace('hidden', 'block');
    shippingAdressComponent.classList.replace('opacity-0', 'opacity-100');
    shippingAdressComponent.classList.replace('scale-50', 'scale-100');
  }
});