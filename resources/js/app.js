// Burger menus
document.addEventListener('DOMContentLoaded', function() {
  // open
  const burger = document.querySelectorAll('.navbar-burger');
  const menu = document.querySelectorAll('.navbar-menu');

  if (burger.length && menu.length) {
      for (let i = 0; i < burger.length; i++) {
          burger[i].addEventListener('click', function() {
              for (let j = 0; j < menu.length; j++) {
                  menu[j].classList.toggle('hidden');
              }
          });
      }
  }

  // close
  const close = document.querySelectorAll('.navbar-close');
  const backdrop = document.querySelectorAll('.navbar-backdrop');

  if (close.length) {
      for (let i = 0; i < close.length; i++) {
          close[i].addEventListener('click', function() {
              for (let j = 0; j < menu.length; j++) {
                  menu[j].classList.toggle('hidden');
              }
          });
      }
  }

  if (backdrop.length) {
      for (var i = 0; i < backdrop.length; i++) {
          backdrop[i].addEventListener('click', function() {
              for (var j = 0; j < menu.length; j++) {
                  menu[j].classList.toggle('hidden');
              }
          });
      }
  }
});

// DropDown Menu Profile

const dropDown = document.getElementById('drop_down_profile');
const userButton = document.getElementById('user_button');

userButton.addEventListener('click', () => {
  if (dropDown.classList.contains('block')) {
    dropDown.classList.replace('block', 'hidden');
    dropDown.classList.replace('opacity-100', 'opacity-0');
  } else {
    dropDown.classList.replace('hidden', 'block');
    dropDown.classList.replace('opacity-0', 'opacity-100');
  }
});

//Dashboard


// BUG deplacer ceci ailleurs car c'est appelé partout et un message d'erreur s'affiche dans la console
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







