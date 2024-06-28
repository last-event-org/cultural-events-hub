import flatpickr from "flatpickr";
import { French } from "flatpickr/dist/l10n/fr.js";
import "flatpickr/dist/flatpickr.min.css";

document.addEventListener("DOMContentLoaded", () => {
    flatpickr(".datepicker", {
        dateFormat: "l, d-m-Y",
        locale: French, 

        //exemple sur un onChange
        onChange: (selectedDates, dateStr, instance) => {
          console.log(dateStr);
          applyDateFilter(dateStr);
        }
    });
});

function applyDateFilter(date) {
  
  console.log("Filtre appliqué pour la date : ", date);
}