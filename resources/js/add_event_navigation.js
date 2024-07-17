let currentStep = 0;
const steps = document.querySelectorAll('.step');
const progressBar = document.querySelector('.progress');
let totalSteps = 7;

function navigateStep(direction) {
  const newStep = currentStep + direction;

  if (newStep >= 0 && newStep < totalSteps) {
    steps[currentStep].classList.remove('active');
    steps[newStep].classList.add('active');
    currentStep = newStep;
    updateProgressBar();
    updateStepDisplay();
  }
  updateButtons();
  
}
function updateStepDisplay() {
  document.getElementById('currentStepDisplay').textContent = currentStep + 1;
}

function updateProgressBar() {
  const progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn'); 

  prevBtn.style.display = currentStep === 0 ? 'none' : 'flex';

  if (currentStep === totalSteps - 1) {
    nextBtn.classList.add('hidden')
    nextBtn.classList.remove('flex')
  } else {
    nextBtn.classList.remove('hidden')
    nextBtn.classList.add('flex')  
  }
}

// Init
steps[0].classList.add('active');
updateButtons();
updateProgressBar();