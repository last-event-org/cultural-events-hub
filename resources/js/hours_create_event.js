        // Set default start and end date for the event
        document.addEventListener('DOMContentLoaded', function () {
          // Set the desired event start date and time value (defaults to now()) 
          // + 2 hours => UTC
          const start_date = new Date();
          start_date.setHours(start_date.getHours() + 2);

          // Set the event end date and time values 
          // + 4 hours (default event length of 2h)
          const end_date = new Date();
          end_date.setHours(end_date.getHours() + 4);
          
          // Format the date to match the 'datetime-local' input format
          const formattedStartDate = start_date.toISOString().slice(0, 16);
          document.getElementById('event_start').value = formattedStartDate;
          const formattedEndDate = end_date.toISOString().slice(0, 16);
          document.getElementById('event_end').value = formattedEndDate;
      });