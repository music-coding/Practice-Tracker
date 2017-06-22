var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    day: {
      type: String,
      required: true,
      trim: true
    },
    time: {
      type: String,
      required: true,
      trim: true
    },
    id : {
      type: String,
      required: true,
      trim: true
    },
});

var Log = mongoose.model('log', logSchema);
module.exports = Log;
