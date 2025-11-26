function convertTime(){
    var offset = new Date().getTimezoneOffset();
    var offsetHour = offset/60;
    return offsetHour
}

export {convertTime};