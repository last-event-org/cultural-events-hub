
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
      return starTrigger.classList.contains('star-filled');
    }

    function fillStar() {
      starTrigger.classList.add('star-filled');
    }

    function emptyStar() {
      starTrigger.classList.remove('star-filled');
    }

    function saveInitialState() {
      initialState = isStarFilled();
    }

    function restoreInitialState() {
      if (initialState) {
        fillStar();
      } else {
        emptyStar();
      }
    }

    saveInitialState();

    starTrigger.addEventListener('mouseenter', () => {
      if (isStarFilled()) {
        emptyStar();
      } else {
        fillStar();
      }
    });

    starTrigger.addEventListener('mouseleave', restoreInitialState);

    starTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (isStarFilled()) {
        emptyStar();
      } else {
        fillStar();
      }
      saveInitialState();
      setTimeout(() => {
        e.target.closest('form').submit();
      }, 300);
    });
  }
});