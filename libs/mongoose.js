const mongoose = require('mongoose');
const config = require('config');
mongoose.Promise = Promise;

const beautifyUnique = require('mongoose-beautiful-unique-validation');

//mongoose.set('debug', true);

mongoose.connect(config.mongoose.uri, config.mongoose.options);

mongoose.plugin(beautifyUnique);

module.exports = mongoose;