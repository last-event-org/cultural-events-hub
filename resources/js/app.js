// Navbar scroll up 
document.addEventListener('DOMContentLoaded', function() {
  let lastScrollTop = 0;
  const mainNav = document.getElementById('main-nav');
  const mobileNav = document.getElementById('mobile-nav');
  let mainNavHeight = mainNav ? mainNav.offsetHeight : 0;
  let isMobileNavVisible = false;

  // Fonction pour ajuster le padding du body
  function adjustBodyPadding() {
    if (mainNav) {
      mainNavHeight = mainNav.offsetHeight;
      document.body.style.paddingTop = `${mainNavHeight}px`;
    }
  }

  // Ajuster le padding au chargement
  adjustBodyPadding();

  // Ajuster le padding lors du redimensionnement de la fenêtre
  window.addEventListener('resize', adjustBodyPadding);

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Gestion de la nav principale (desktop)
    if (mainNav) {
      if (scrollTop > lastScrollTop && scrollTop > mainNavHeight) {
        // Scroll vers le bas
        mainNav.style.transform = `translateY(-${mainNavHeight}px)`;
        document.body.style.paddingTop = '0px';
      } else {
        // Scroll vers le haut
        mainNav.style.transform = 'translateY(0)';
        document.body.style.paddingTop = `${mainNavHeight}px`;
      }
    }

    // Gestion de la nav mobile (inchangée)
    if (mobileNav) {
      if (scrollTop > lastScrollTop) {
        // Scroll vers le bas
        if (isMobileNavVisible) {
          mobileNav.style.transform = 'translateX(-100%)';
          isMobileNavVisible = false;
        }
      } else {
        // Scroll vers le haut
        if (!isMobileNavVisible) {
          mobileNav.style.transform = 'translateX(0)';
          isMobileNavVisible = true;
        }
      }
    }
    
    lastScrollTop = scrollTop;
  });
});


// Burger menus
document.addEventListener('DOMContentLoaded', function () {
  // open
  const burger = document.querySelectorAll('.navbar-burger')
  const menu = document.querySelectorAll('.navbar-menu')

  if (burger.length && menu.length) {
    for (let i = 0; i < burger.length; i++) {
      burger[i].addEventListener('click', function () {
        for (let j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden')
        }
      })
    }
  }

  // close
  const close = document.querySelectorAll('.navbar-close')
  const backdrop = document.querySelectorAll('.navbar-backdrop')

  if (close.length) {
    for (let i = 0; i < close.length; i++) {
      close[i].addEventListener('click', function () {
        for (let j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden')
        }
      })
    }
  }

  if (backdrop.length) {
    for (var i = 0; i < backdrop.length; i++) {
      backdrop[i].addEventListener('click', function () {
        for (var j = 0; j < menu.length; j++) {
          menu[j].classList.toggle('hidden')
        }
      })
    }
  }
})

// DropDown Menu Profile

const dropDown = document.getElementById('drop_down_profile')
const userButton = document.getElementById('user_button')
if (userButton) {
  userButton.addEventListener('click', () => {
    if (dropDown.classList.contains('block')) {
      dropDown.classList.replace('block', 'hidden')
      dropDown.classList.replace('opacity-100', 'opacity-0')
    } else {
      dropDown.classList.replace('hidden', 'block')
      dropDown.classList.replace('opacity-0', 'opacity-100')
    }
  })
}

// Language button

const button = document.getElementById('language-menu-button')
const menu = document.getElementById('language-menu')

button.addEventListener('click', () => {
  menu.classList.toggle('hidden')
})

window.addEventListener('click', (e) => {
  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.add('hidden')
  }
});

// searchbar

document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search_event_button');
  const searchBar = document.getElementById('search_event_bar');

  searchButton.addEventListener('click', function(e) {
      e.stopPropagation(); 
      searchBar.classList.toggle('hidden');
  });

  document.addEventListener('click', function(e) {
      if (!searchBar.contains(e.target) && !searchButton.contains(e.target)) {
          searchBar.classList.add('hidden');
      }
  });

  searchBar.addEventListener('click', function(e) {
      e.stopPropagation();
  });
});

