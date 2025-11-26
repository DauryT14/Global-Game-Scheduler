import data from './data.json' assert {type: 'json'};
import {getOffset, getTZIdentifier} from './tools.js'

var person = data

console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log(Date.UTC())

console.log(getOffset())

