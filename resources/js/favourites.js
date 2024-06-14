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