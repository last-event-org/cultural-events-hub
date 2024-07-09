
const heartHoverTarget = document.getElementById('favourite-heart')
const heartChangeClass = document.getElementById('add-to-favourites')

if(heartHoverTarget){

  heartHoverTarget.addEventListener('mouseenter', () => {
    heartChangeClass.classList.add('block', 'opacity-100', 'scale-100', 'translate-x-0')
    heartChangeClass.classList.remove('hidden', 'opacity-0', 'scale-50', '-translate-x-full')
  })
  
  heartHoverTarget.addEventListener('mouseleave', () => {
    heartChangeClass.classList.add('hidden', 'opacity-0', 'scale-50', '-translate-x-full')
    heartChangeClass.classList.remove('block', 'opacity-100', 'scale-100', 'translate-x-0')
  })


}


document.addEventListener('DOMContentLoaded', () => {
  const starTrigger = document.querySelector('.favourite-star');
  const starEmpty = starTrigger.querySelector('.star-empty');
  const starFull = starTrigger.querySelector('.star-full');

  if (starTrigger && starEmpty && starFull) {
    let initialState;

    function isStarFilled() {
      return !starFull.classList.contains('hidden');
    }

    function showFullStar() {
      starEmpty.classList.add('hidden');
      starFull.classList.remove('hidden');
    }

    function showEmptyStar() {
      starEmpty.classList.remove('hidden');
      starFull.classList.add('hidden');
    }

    function saveInitialState() {
      initialState = isStarFilled();
    }

    function restoreInitialState() {
      if (initialState) {
        showFullStar();
      } else {
        showEmptyStar();
      }
    }

    // Sauvegarde l'état initial
    saveInitialState();

    // Animation au survol
    starTrigger.addEventListener('mouseenter', () => {
      if (isStarFilled()) {
        showEmptyStar();
      } else {
        showFullStar();
      }
    });

    starTrigger.addEventListener('mouseleave', restoreInitialState);

    // Gestion du clic (si nécessaire)
    starTrigger.addEventListener('click', (e) => {
      // Empêche le formulaire de se soumettre immédiatement
      e.preventDefault();
      
      // Inverse l'état
      if (isStarFilled()) {
        showEmptyStar();
      } else {
        showFullStar();
      }
      
      // Sauvegarde le nouvel état
      saveInitialState();
      
      // Soumet le formulaire
      e.target.closest('form').submit();
    });
  }
});