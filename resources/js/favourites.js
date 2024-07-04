const starHoverTarget = document.getElementById('favourite-star')
const starChangeClass = document.getElementById('add-to-wishlist')

starHoverTarget.addEventListener('mouseenter', () => {
  starChangeClass.classList.add('block', 'opacity-100', 'scale-100', 'translate-x-0')
  starChangeClass.classList.remove('hidden', 'opacity-0', 'scale-50', '-translate-x-full')
})

starHoverTarget.addEventListener('mouseleave', () => {
  starChangeClass.classList.add('hidden', 'opacity-0', 'scale-50', '-translate-x-full')
  starChangeClass.classList.remove('block', 'opacity-100', 'scale-100', 'translate-x-0')
})


const heartHoverTarget = document.getElementById('favourite-heart')
const heartChangeClass = document.getElementById('add-to-favourites')

heartHoverTarget.addEventListener('mouseenter', () => {
  heartChangeClass.classList.add('block', 'opacity-100', 'scale-100', 'translate-x-0')
  heartChangeClass.classList.remove('hidden', 'opacity-0', 'scale-50', '-translate-x-full')
})

heartHoverTarget.addEventListener('mouseleave', () => {
  heartChangeClass.classList.add('hidden', 'opacity-0', 'scale-50', '-translate-x-full')
  heartChangeClass.classList.remove('block', 'opacity-100', 'scale-100', 'translate-x-0')
})


const heartTrigger = document.getElementById('favourite-heart')
const heartEmpty = document.getElementById('heart_empty')
const heartFull = document.getElementById('heart_full')

heartTrigger.addEventListener('mouseenter', () => {
  heartFull.classList.remove('hidden')
  heartFull.classList.add('block')
  heartEmpty.classList.remove('block')
  heartEmpty.classList.add('hidden')
})

heartTrigger.addEventListener('mouseleave', () => {
  heartFull.classList.remove('block')
  heartFull.classList.add('hidden')
  heartEmpty.classList.remove('hidden')
  heartEmpty.classList.add('block')
})

const starTrigger = document.getElementById('favourite-star')
const starEmpty = document.getElementById('star_empty')
const starFull = document.getElementById('star_full')

starTrigger.addEventListener('mouseenter', () => {
  starFull.classList.remove('hidden')
  starFull.classList.add('block')
  starEmpty.classList.remove('block')
  starEmpty.classList.add('hidden')
})

starTrigger.addEventListener('mouseleave', () => {
  starFull.classList.remove('block')
  starFull.classList.add('hidden')
  starEmpty.classList.remove('hidden')
  starEmpty.classList.add('block')
})