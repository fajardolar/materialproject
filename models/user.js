var Mongoose = require('../database').Mongoose;

//create the schema
var userSchema = new Mongoose.Schema({
	email: {
    type: String,
    required: true
  },
	password: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    required: true
  },
	creationDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

userSchema.plugin(require('passport-local-mongoose'), {
  usernameField: 'email',
  hashField: 'password',
  usernameLowerCase: true
});

// userSchema.methods.setPassword = function (password, cb) {
//     if (!password) {
//         return cb(new BadRequestError(options.missingPasswordError));
//     }

//     var self = this;

//     crypto.randomBytes(options.saltlen, function(err, buf) {
//         if (err) {
//             return cb(err);
//         }

//         var salt = buf.toString('hex');

//         crypto.pbkdf2(password, salt, options.iterations, options.keylen, function(err, hashRaw) {
//             if (err) {
//                 return cb(err);
//             }

//             self.set(options.hashField, new Buffer(hashRaw, 'binary').toString('hex'));
//             self.set(options.saltField, salt);

//             cb(null, self);
//         });
//     });
// };

//create the model and add it to the exports
module.exports = Mongoose.model('User', userSchema, 'Users');
