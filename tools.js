function getOffset(){
    var offset = new Date().getTimezoneOffset();
    var offsetHour = offset/60;
    return offsetHour
}

function convertToMatrix(person, hours){

}

export {getOffset, convertToMatrix, constructGrid};