

const nano = require('nano')('http://admin:1234@localhost:5984');
//если нет такой базы - создать 
const vstup = nano.db.use('vstup');
const users = nano.db.use('users');
const tools = nano.db.use('tools');
//возможно даже заполнить
module.exports ={vstup, users, tools, nano}