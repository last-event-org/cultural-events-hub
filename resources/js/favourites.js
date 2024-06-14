const hoverTarget = document.getElementById('favourite-star');
const changeClass = document.getElementById('add-to-favourites');

hoverTarget.addEventListener('mouseenter', () => {
    changeClass.classList.add('block','opacity-100', 'scale-100', 'translate-x-0');
    changeClass.classList.remove('hidden','opacity-0', 'scale-50','-translate-x-full');
});

hoverTarget.addEventListener('mouseleave', () => {
    changeClass.classList.add('hidden','opacity-0', 'scale-50','-translate-x-full');
    changeClass.classList.remove('block','opacity-100', 'scale-100', 'translate-x-0');
});

const heartTrigger = document.getElementById('heart_trigger');
const heartEmpty = document.getElementById('heart_empty');
const heartFull = document.getElementById('heart_full');

heartTrigger.addEventListener('mouseenter', () => {
  heartFull.classList.remove('hidden');
    heartFull.classList.add('block');
    heartEmpty.classList.remove('block');
    heartEmpty.classList.add('hidden');
});

heartTrigger.addEventListener('mouseleave', () => {
  heartFull.classList.remove('block');
  heartFull.classList.add('hidden');
  heartEmpty.classList.remove('hidden');
  heartEmpty.classList.add('block');
});