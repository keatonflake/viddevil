const dotenv = require('dotenv');
dotenv.config();

const mongoose = require("mongoose");
mongoose.promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;
console.log(1);

db.Movie = require('./movie.js')(mongoose);

module.exports = db;