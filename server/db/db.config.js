const {USER, PASSWORD} = require('../config');
const nano = require('nano')(`http://${USER}:${PASSWORD}@couch:5984`);
const vstup = nano.db.use('vstup');
const users = nano.db.use('users');
const tools = nano.db.use('tools');
module.exports ={vstup, users, tools, nano}
