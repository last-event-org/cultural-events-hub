import './add_event'
import './add_event_navigation'
import './cart'
import './categories'
import './countdown'
import './date_format'
import './destroy_event'
import './dropdown_address'
import './fade_animations'
import './favourites'
import './filters-buttons/date_picker'
import './filters-buttons/map_button'
import './geolocation'
import './hours_create_event'
import './locations'
import './map_details'
import './map_events'
import './map_home'
import './modale_form'
import './price_fields'
import './show_password'
import './top_events'

// Navbar scroll up
document.addEventListener('DOMContentLoaded', function () {
  let lastScrollTop = 0
  const mainNav = document.getElementById('main-nav')
  const mobileNav = document.getElementById('mobile-nav')
  let mainNavHeight = mainNav ? mainNav.offsetHeight : 0
  let isMobileNavVisible = false

  function adjustBodyPadding() {
    if (mainNav) {
      mainNavHeight = mainNav.offsetHeight
      document.body.style.paddingTop = `${mainNavHeight}px`
    }
  }

  adjustBodyPadding()

  window.addEventListener('resize', adjustBodyPadding)

  window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop

    if (mainNav) {
      if (scrollTop > lastScrollTop && scrollTop > mainNavHeight) {
        mainNav.style.transform = `translateY(-${mainNavHeight}px)`
        document.body.style.paddingTop = '0px'
      } else {
        mainNav.style.transform = 'translateY(0)'
        document.body.style.paddingTop = `${mainNavHeight}px`
      }
    }

    if (mobileNav) {
      if (scrollTop > lastScrollTop) {
        if (isMobileNavVisible) {
          mobileNav.style.transform = 'translateX(-100%)'
          isMobileNavVisible = false
        }
      } else {
        if (!isMobileNavVisible) {
          mobileNav.style.transform = 'translateX(0)'
          isMobileNavVisible = true
        }
      }
    }

    lastScrollTop = scrollTop
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const burger = document.querySelector('.navbar-burger')
  const menu = document.querySelector('.navbar-menu')
  const close = document.querySelector('.navbar-close')
  const backdrop = document.querySelector('.navbar-backdrop')
  const mobileNav = document.querySelector('#mobile-nav')

  function toggleMenu() {
    menu.classList.toggle('hidden')
    document.body.classList.toggle('overflow-hidden')

    if (!menu.classList.contains('hidden')) {
      setTimeout(() => {
        mobileNav.style.transform = 'translateX(0)'
      }, 10)
    } else {
      mobileNav.style.transform = 'translateX(-100%)'
    }
  }

  if (burger) {
    burger.addEventListener('click', toggleMenu)
  }

  if (close) {
    close.addEventListener('click', toggleMenu)
  }

  if (backdrop) {
    backdrop.addEventListener('click', toggleMenu)
  }
})

// DropDown Menu Profile

document.addEventListener('DOMContentLoaded', function () {
  const dropDown = document.getElementById('drop_down_profile')
  const userButton = document.getElementById('user_button')

  function openDropdown() {
    dropDown.classList.replace('hidden', 'block')
    dropDown.classList.replace('opacity-0', 'opacity-100')
  }

  function closeDropdown() {
    dropDown.classList.replace('block', 'hidden')
    dropDown.classList.replace('opacity-100', 'opacity-0')
  }

  function toggleDropdown(event) {
    event.stopPropagation()
    if (dropDown.classList.contains('block')) {
      closeDropdown()
    } else {
      openDropdown()
    }
  }

  if (userButton) {
    userButton.addEventListener('click', toggleDropdown)
  }

  document.addEventListener('click', function (event) {
    if (
      dropDown.classList.contains('block') &&
      !dropDown.contains(event.target) &&
      event.target !== userButton
    ) {
      closeDropdown()
    }
  })

  dropDown.addEventListener('click', function (event) {
    event.stopPropagation()
  })
})

// Language button

document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.language-dropdown')

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector('.language-menu-button')
    const menu = dropdown.querySelector('.language-menu')

    button.addEventListener('click', (e) => {
      e.stopPropagation()
      menu.classList.toggle('hidden')
    })

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        menu.classList.add('hidden')
      }
    })
  })
})

// searchbar

document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.getElementById('search_event_button')
  const searchBar = document.getElementById('search_event_bar')

  searchButton.addEventListener('click', function (e) {
    e.stopPropagation()
    searchBar.classList.toggle('hidden')
  })

  document.addEventListener('click', function (e) {
    if (!searchBar.contains(e.target) && !searchButton.contains(e.target)) {
      searchBar.classList.add('hidden')
    }
  })

  searchBar.addEventListener('click', function (e) {
    e.stopPropagation()
  })
})

//loading spinner

document.addEventListener('DOMContentLoaded', () => {
  const spinner = document.querySelector('.loading-spinner')
  if (spinner !== null) {
    function showSpinner() {
      spinner.classList.remove('hidden')
    }

    function hideSpinner() {
      spinner.classList.add('hidden')
    }

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        showSpinner()
      }
    })

    document.addEventListener('submit', () => {
      showSpinner()
    })

    window.addEventListener('load', hideSpinner)
  }
})
