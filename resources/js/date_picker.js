document.addEventListener('DOMContentLoaded', function() {
  const datePicker = document.getElementById('date-picker');
  const prevButton = document.getElementById('prev-day');
  const nextButton = document.getElementById('next-day');

  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const today = new Date();
  
  let currentDate = new Date(today);
  let selectedDate = new Date(today);

  function updateDatePicker() {
    datePicker.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);

      const dayOfWeek = daysOfWeek[date.getDay()];
      const dayOfMonth = date.getDate();

      const isSelected = date.toDateString() === selectedDate.toDateString() ? 'bg-indigo-300 shadow-lg light-shadow' : 'hover:bg-indigo-100 hover:shadow-lg hover-light-shadow';
      const isFontBold = date.toDateString() === selectedDate.toDateString() ? 'font-bold' : 'group-hover:font-bold';

      const dayElement = document.createElement('div');
      dayElement.className = `flex group ${isSelected} rounded-lg mx-1 transition-all duration-300 cursor-pointer justify-center w-10 sm:w-16`;
      dayElement.innerHTML = `
        <div class='flex items-center px-4 py-2 sm:py-4'>
          <div class='text-center'>
            <p class='${date.toDateString() === selectedDate.toDateString() ? "text-indigo-900" : "text-slate-900 group-hover:text-indigo-900"} text-sm transition-all duration-300'>${dayOfWeek}</p>
            <p class='${date.toDateString() === selectedDate.toDateString() ? "text-indigo-900" : "text-slate-900 group-hover:text-indigo-900"} mt-3 ${isFontBold} transition-all duration-300'>${dayOfMonth}</p>
          </div>
        </div>
      `;
      dayElement.addEventListener('click', function() {
        selectedDate = new Date(date);
        updateDatePicker();
      });
      datePicker.appendChild(dayElement);
    }
  }

  prevButton.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDatePicker();
  });

  nextButton.addEventListener('click', function() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDatePicker();
  });

  
  updateDatePicker();
});