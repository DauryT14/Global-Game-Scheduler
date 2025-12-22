document.getElementById("eventForm").addEventListener('submit', function(event){
    event.preventDefault();
    createEvent();
});

document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.bestTimesBtn').forEach(button =>{
        button.addEventListener('click', function(){
            this.classList.toggle('active');
            this.textContent = this.classList.contains('active') ? 'ON' : 'OFF';
        });
    });
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

    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const todayStr = localDate.toISOString().split('T')[0];

    if (dateInput < todayStr){
        alert('Cannot create events in the past!');
        return;
    }

    window.location.href = "graph.html?event=" + encodeURIComponent(eventName);
}