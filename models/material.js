var Mongoose = require('../database').Mongoose;

//create the schema
var userSchema = new Mongoose.Schema({
	material_id: {
    type: Number,
    required: true
  },
	material: {
    type: String,
    required: true
  }
});

//create the model and add it to the exports
module.exports = Mongoose.model('Material', userSchema, 'Materials');
