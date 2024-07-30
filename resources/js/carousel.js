document.addEventListener('DOMContentLoaded', function() {
  const image = document.getElementById('carouselImage');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const mediaString = image.getAttribute('data-event-media');
  const media = mediaString ? mediaString.split('||').map(item => {
    const [path, altName] = item.split('::');
    return { path, altName };
  }) : [];
  let currentIndex = 0;

  // modal fullscreen
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');

  function updateImage() {
    if (media[currentIndex]) {
      image.src = media[currentIndex].path || '/images/dummies/No_image.png';
      image.alt = media[currentIndex].altName || 'Event image';
    } else {
      image.src = '/images/dummies/No_image.png';
      image.alt = 'No picture available';
    }
  }

  nextButton.onclick = function() {
    currentIndex = (currentIndex + 1) % media.length;
    updateImage();
  };

  prevButton.onclick = function() {
    currentIndex = (currentIndex - 1 + media.length) % media.length;
    updateImage();
  };

  if (media.length <= 1) {
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
  }

  image.addEventListener('click', function() {
    modalImage.src = this.src;
    imageModal.classList.remove('hidden');
    setTimeout(() => {
      imageModal.classList.remove('opacity-0');
    }, 10);
  });

  function closeModalWithTransition() {
    imageModal.classList.add('opacity-0');
    setTimeout(() => {
      imageModal.classList.add('hidden');
    }, 300);
  }

  closeModal.addEventListener('click', closeModalWithTransition);

  imageModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModalWithTransition();
    }
  });
});