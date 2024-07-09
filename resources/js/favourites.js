
document.addEventListener('DOMContentLoaded', () => {
  const heartTrigger = document.querySelector('.favourite-heart');
  const heartEmpty = heartTrigger.querySelector('.heart-empty');
  const heartFull = heartTrigger.querySelector('.heart-full');

  if (heartTrigger && heartEmpty && heartFull) {
    let initialHeartState;

    function isHeartFilled() {
      return heartTrigger.classList.contains('heart-filled');
    }

    function fillHeart() {
      heartTrigger.classList.add('heart-filled');
    }

    function emptyHeart() {
      heartTrigger.classList.remove('heart-filled');
    }

    function saveInitialHeartState() {
      initialHeartState = isHeartFilled();
    }

    function restoreInitialHeartState() {
      if (initialHeartState) {
        fillHeart();
      } else {
        emptyHeart();
      }
    }

    saveInitialHeartState();

    heartTrigger.addEventListener('mouseenter', () => {
      if (isHeartFilled()) {
        emptyHeart();
      } else {
        fillHeart();
      }
    });

    heartTrigger.addEventListener('mouseleave', restoreInitialHeartState);

    heartTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (isHeartFilled()) {
        emptyHeart();
      } else {
        fillHeart();
      }
      saveInitialHeartState();
      setTimeout(() => {
        e.target.closest('form').submit();
      }, 300);
    });
  }
});

// WISHLIST BUTTON
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