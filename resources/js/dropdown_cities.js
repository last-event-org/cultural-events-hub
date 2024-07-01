  //drop-down city list
  document.getElementById('search').addEventListener('focus', function() {
    document.getElementById('city-list').classList.remove('hidden');
  });

  document.addEventListener('click', function(event) {
    const isClickInside = document.getElementById('search').contains(event.target) || document.getElementById('city-list').contains(event.target);
    if (!isClickInside) {
      document.getElementById('city-list').classList.add('hidden');
    }
  });