

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









