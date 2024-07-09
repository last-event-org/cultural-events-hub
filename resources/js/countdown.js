
function updateCountdown() {
  document.querySelectorAll('[id^="countdown-"]').forEach(element => {
    const eventStartString = element.dataset.eventStart;
    if (!eventStartString) return;

    const eventStart = new Date(eventStartString);
    const now = new Date();
    const distance = eventStart - now;

    if (distance < 0) {
      element.querySelector('.countdown-timer').textContent = "Commencé";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    let countdownText = '';
    if (days > 0) countdownText += `${days}j `;
    countdownText += `${hours}h${minutes}:${seconds.toString().padStart(2, '0')}`;

    const timerElement = element.querySelector('.countdown-timer');
    if (timerElement) {
      timerElement.textContent = countdownText;
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setInterval(updateCountdown, 1000);
  updateCountdown();
});
