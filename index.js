function createEvent(){
    const eventName = document.getElementById("event").value.trim();
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;
    const dateInput = document.getElementById("date").value;
    
    // Event name validation
    if (eventName == ""){
        alert('Please enter an event name!');
        return;
    }
    
    // Date validation
    if (dateInput == "") {
        alert('Please select a date!');
        return;
    }
    
    // Time validation (optional)
    if (startTime == endTime) {
        alert('Please select both start and end times!');
        return;
    }
    
    window.location.href = "graph.html";
}