var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
   task : {
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

var Todo = mongoose.model('todo', todoSchema);
module.exports = Todo;
