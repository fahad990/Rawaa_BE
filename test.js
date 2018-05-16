let moment = require('moment')

console.log(moment().toDate().getTime());

let b = moment().add(10, 'minit').toDate().getTime()
console.log(b)