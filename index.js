document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('eventForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        createEvent();
    }}'
}};

function createEvent(){
    const eventName = document.getElementById("event").value.trim();
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const dateInput = document.getElementById("date").value;
    
    if (!eventName){
        alert('Please enter an event name!');
        return;
    }

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

    // Build simple event object
    const eventObj = {
        name: eventName,
        date: dateInput,
        start: startTime,
        end: endTime
    };

    // Save to local storage and 'graph.html' can read it
    localStorage.setItem('ggs_event', JSON.stringify(eventObj));
    window.location.href = 'graph.html';
}