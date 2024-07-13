// Navbar scroll up 
document.addEventListener('DOMContentLoaded', function() {
  let lastScrollTop = 0;
  const mainNav = document.getElementById('main-nav');
  const mobileNav = document.getElementById('mobile-nav');
  const headerSpacer = document.getElementById('header-spacer');
  let mainNavHeight = mainNav ? mainNav.offsetHeight : 0;
  let isMobileNavVisible = false;

  // spacer adjustement because of the header fixed position
  function adjustHeaderSpacer() {
    if (mainNav && headerSpacer) {
      mainNavHeight = mainNav.offsetHeight;
      headerSpacer.style.height = `${mainNavHeight}px`;
    }
  }

  adjustHeaderSpacer();
  window.addEventListener('resize', adjustHeaderSpacer);
  window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (mainNav) {
      if (scrollTop > lastScrollTop && scrollTop > mainNavHeight) {
        mainNav.style.transform = `translateY(-${mainNavHeight}px)`;
        headerSpacer.style.height = '0px';
      } else {
        mainNav.style.transform = 'translateY(0)';
        headerSpacer.style.height = `${mainNavHeight}px`;
      }
    }

    if (mobileNav) {
      if (scrollTop > lastScrollTop) {
        if (isMobileNavVisible) {
          mobileNav.style.transform = 'translateX(-100%)';
          isMobileNavVisible = false;
        }
      } else {
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

