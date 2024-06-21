// utils/formatDate.js
function formatDate(dateString) {
  const date = new Date(dateString);
  
  // Tableau des jours et des mois en français
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

  // Obtenir les composants de la date
  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  // Retourner la date formatée
  return console.log(`${dayName} ${day} ${month}, ${hours}h${minutes}`);
}

// export default { formatDate };