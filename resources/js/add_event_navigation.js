let currentStep = 0;
const steps = document.querySelectorAll('.step');
const progressBar = document.querySelector('.progress');
let totalSteps = 7;

function checkSteps(currentStep) {
  if (currentStep == 0) {
    let step1ok = true
    document.getElementById("step1").querySelectorAll("[required]").forEach(function(i) {
      if (!i.value) {
        step1ok = false
      }
    })
    if (!step1ok) {
      alert('Fill all the fields');
      return false
    }
  } else if (currentStep == 1) {
    let step2ok = true
    document.getElementById("step2").querySelectorAll("[required]").forEach(function(i) {
      if (!i.value) {
        step2ok = false
      }
    })
    if (!step2ok) {
      alert('Fill all the fields');
      return false
    }
  } else if (currentStep == 3) {
    let step4ok = false
    document.getElementsByName("categoryTypes[]").forEach(function(i) {
      if (i.checked) {
        step4ok = true
      }
    })
    if (!step4ok) {
      alert('One category and one subcategory must be filled');
      return false
    }
  } else if (currentStep == 5) {
    const previewContainer = document.getElementById('imagePreviewContainer')
    if (previewContainer.childNodes.length === 0) {
      alert('At least one picture must be added');
      return false
    }
  }
  return true
}

function navigateStep(direction) {
  const newStep = currentStep + direction;

  const canContinue = checkSteps(currentStep)

  if (canContinue) {
    if (newStep >= 0 && newStep < totalSteps) {
      steps[currentStep].classList.remove('active');
      steps[newStep].classList.add('active');
      currentStep = newStep;
      updateProgressBar();
      updateStepDisplay();
    }
    updateButtons();
  } else {
    return
  }
  
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