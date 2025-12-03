document.getElementById("eventForm").addEventListener('submit', function(event){
    event.preventDefault();
    createEvent();
});

function createEvent(){
    const eventName = document.getElementById("event").value.trim();
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const dateInput = document.getElementById("date").value;
    
    if (eventName == ""){
        alert('Please enter an event name!');
        return;
    }

    if (startTime == endTime || endTime < startTime){
        alert('Please enter a valid start time and end time');
        return;
    }

    if (dateInput == ""){
        alert('Please enter a date!');
        return;
    }

    const chosenDate = new Date(dateInput);
    const chosenYear = chosenDate.getFullYear();

    if (chosenYear < 2025){
        alert('Please enter a valid date (year must be 2025 or later).');
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (chosenDate < today){
        alert('Please enter a date today or in the future.');
        return;
    }

    window.location.href = "graph.html";
}