document.getElementById("eventForm").addEventListener('submit', function(event){
    event.preventDefault();
    createEvent();
});

function createEvent(){
    const eventName = document.getElementById("event").value.trim();
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const dateInput = document.getElementById("date").value;
    
    if (!eventName){
        alert('Please enter an event name!');
        return;
    }

    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    if (startHour >= endHour) {
        alert('Start time must be earilier than end time!');
        return;
    }

    if (startTime == endTime){
        alert('Please enter a valid start time and end time');
        return;
    }

    if (!dateInput){
        alert('Please enter a date!');
        return;
    }
    // Pass data to the next page
    window.location.href = `graph.html?event=${encodeURIComponent(eventName)}&date=${dateInput}` + `&start=${startTime}&end=${endTime}`;
}
