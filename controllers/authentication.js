var Joi = require('joi');
var User = require('../models/user');
var Email, materials, _firstName, _lastName, _projectName, _requestorName, _areaName;
var Material = require('../models/material');
var srsList = [];
var Pages = require('./pages');
/**
 * Responds to POST /login and logs the user in, well, soon.
 */
exports.login = {
  handler: function (request, reply) {

    // In the version with Travelogue and Mongoose this was all handled by Passport (hence we retrieved
    // Passport and inserted the request and reply variables).
    User.authenticate()(request.payload.email, request.payload.password, function (err, user, passwordError) {

      // There has been an error, do something with it. I just print it to console for demo purposes.
      if (err) {
        console.error(err);
        return reply.redirect('/login');
      }
      // Something went wrong with the login process, could be any of:
      // https://github.com/saintedlama/passport-local-mongoose#error-messages
      if (passwordError) {
        // For now, just show the error and login form
        console.log(passwordError);
        return reply.view('login', {
          errorMessage: passwordError.message,
        });
      }

      // If the authentication failed user will be false. If it's not false, we store the user
      // in our session and redirect the user to the hideout
      if (user) {

        request.cookieAuth.set(user);

        console.log(user.firstname);
        Email = request.payload.email;
        _firstName = user.firstname;
        _lastName = user.lastname;

        return reply.redirect('/profile');
      }

      return reply.redirect('/login');

    });
  }
};


// *
//  * Responds to GET /logout and logs out the user
 
exports.logout = {
  auth: 'session',
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply().redirect('/');
  }
};

exports.edit = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  },
  handler: function (request, reply) {

    User.findByUsername(request.payload.email).then(function(sanitizedUser){
    if (sanitizedUser){
        sanitizedUser.setPassword(request.payload.password, function(){
            sanitizedUser.save();
              reply({
                    statusCode: 200,
                    message: 'password reset successful'
                });
         //   res.status(200).json({message: 'password reset successful'});
        });
    } else {
         reply({
                    statusCode: 500,
                    message: 'This user does not exist'
                });
      //  res.status(500).json({message: 'This user does not exist'});
    }
    },function(err){
        console.error(err);
    })
  }

  //   if (request.payload.email) {
  //       //find id that belongs to the user and send it along
  //       User.find({email : request.payload.email}, function (err, user) {
  //           //no user found

  //           if (user === null) {

  //             reply({
  //                   statusCode: 503,
  //                   message: 'no user with that e-mail address'
  //                     });
  //               // return reply.send({
  //               //     success: false,
  //               //     message: "no user with that e-mail address"
  //               // });
  //           } else {

  //               //set the password token
  //               var guid = require('node-uuid');
  //               user.uuid = guid.v1();
  //               // user.save(function (err) {
  //               //     if (!err) {
  //               //         console.log("updated");
  //               //     } else {
  //               //         console.log(err);
  //               //     }
  //               //     //return res.send(user);
  //               // });


  //               console.log("sending e-mail to user with ses");

  //               var email = require("emailjs");
  //               var server = email.server.connect({
  //                   user:  'fajardolaraine@gmail.com',
  //                   password:  'p@ssw0rd1',
  //                   host:  'smtp.gmail.com',
  //                   ssl: true
  //               });

  //               // send the message and get a callback with an error or details of the message that was sent
  //               // this is a link to a password reset page
  //               server.send({
  //                   text: "Please click this link to reset your password: http://localhost:8001/#/reset/" + user.uuid,
  //                   from:  'fajardolaraine@gmail.com',
  //                   to: request.payload.email,
  //                   cc: 'process.env.POSTMASTER',
  //                   subject: "Password reset"
  //               }, function (err, message) {
  //                   console.log(err || message);
  //               });


  //               console.log("e-mail sent??");
  //               // email sent??

  //               reply({
  //                   success: true,
  //                   message: 'message sent!',
  //                   user: user
  //                     });

               

  //           }
  //       });
  //   }
  // }

    //     User.findOneAndUpdate({   email: Email }, request.payload, function (error, data) {
    //         if (error) {
    //            reply({
    //                 statusCode: 503,
    //                 message: 'Failed to get data',
    //                 data: error
    //             });
    //         } else {
    //           Email = request.payload.email;
    //            return reply.redirect('/login');
    //         }
    //   });
    // }
};

// const objectSchema = Joi.object({
//   items: Joi.string().min(1).required()
// }).required();

// const arraySchema = joi.array().items(objectSchema).min(1).unique()
// .required();


exports.confirm = {
  auth: {
    mode: 'try',
    strategy: 'session'
  },
  handler: function (request, reply) {

var materialID = [];
  for(let j=0; j < srsList.length; j++){
    var obj = {}
  obj.material = srsList[j];
  materialID.push(obj)
  }

  console.log(materialID)  

  Material.find({"$or":materialID}, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
              var _material = [];
              for(let i=0; i<data.length; i++){
                var obj = {};
                obj.material = data[i].material;
                obj.material_id = data[i].material_id;
                _material.push(obj);
              }

             var json = {};
             json.materials = _material;
             json.user = {admin : true};
             console.log(json)  
            return reply.view('confirm', json);

            }
        });
  }
};


/**
* removeByIndex
* @param {Array} array
* @param {Number} index
*/
 removeByValue = (array, value) => {
    return array.filter(function(elem, _index){
        return value != elem ? true : false;
    });
};
var l = [1,3,4,5,6,7];


exports.secret = {
  auth: {
    mode: 'try',
    strategy: 'session'
  },
  validate: {
    payload: {
      items: Joi.array().items(Joi.string()).min(1).unique().min(1),
      itemname: Joi.string(), 
      submit: Joi.string(),
      material: Joi.string()
    }
  },
  handler: function (request, reply) {
 
    if(request.payload.submit == 'Add to SRS'){
      for(var i = 0; i < request.payload.items.length; i++){
        srsList.push(request.payload.items[i])
      }
      // return reply.view('secrethideout', { user: {  admin: true }});

       // return console.log("Added")
    } 

    var materialID = [];
    for(let j=0; j < srsList.length; j++){
    var obj = {}
    obj.material = srsList[j];
    materialID.push(obj)
    }

    // if(request.payload.submit == 'Delete'){


               console.log(request.payload.material);

      // for(var i = 0; i < request.payload.items.length; i++){
      //   srsList.remove(request.payload.items[i])
      // }
       // console.log('Items' + request.payload.items)
    //   return reply.redirect('/profile');
    // }


    Material.find({"$or":materialID}, function (error, data) {
              if (error) {
                  reply({
                      statusCode: 503,
                      message: 'Failed to get data',
                      data: error
                  });
              } else {
                var _material = [];
                for(let i=0; i<data.length; i++){
                  var obj = {};
                  obj.material = data[i].material;
                  obj.material_id = data[i].material_id;
                  _material.push(obj);
                }
                
        var objDate = new Date(),
        locale = "en-us",
        month = objDate.toLocaleString(locale, { month: "long" });
        day = objDate.getUTCDate();
        year = objDate.getUTCFullYear();
        var date = month + " " + day + ", " + year; 
               var json = {name: request.auth.credentials.firstname + " " + request.auth.credentials.lastname, usertype : request.auth.credentials.usertype, user: {  admin: true },
                projects : {project_name : request.auth.credentials.projectname, requestor_name : request.auth.credentials.firstname + " " + request.auth.credentials.lastname,
                      area_name : request.auth.credentials.areaname, date : date}};
               json.materials = _material;
               json.user = {admin : true};
               console.log(json)  
             return reply.view('profile', json);
              }
          });

  

    
//   // Create mongodb user object to save it into database
//         var user = new Material(request.payload);

//         //Call save methods to save data into database and pass callback methods to handle error
//         user.save(function (error) {
//             if (error) {
//                 reply({
//                     statusCode: 503,
//                     message: error
//                 });
//             } else {
//                 reply({
//                     statusCode: 201,
//                     message: 'User Saved Successfully'
//                 });
//             }
//         });



        // `findOneAndUpdate` is a mongoose modal methods to update a particular record.
      //   User.findOneAndUpdate({   email: Email }, request.payload, function (error, data) {
      //       if (error) {
      //          reply({
      //               statusCode: 503,
      //               message: 'Failed to get data',
      //               data: error
      //           });
      //       } else {
      //         Email = request.payload.email;
      //          return reply.redirect('/login');
      //           // reply({
      //           //     statusCode: 200,
      //           //     message: 'User Updated Successfully',
      //           //     data: data
      //           // });
      //       }
      // });
    }
};


/**
 * Responds to POST /register and creates a new user.
 */
exports.register = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      usertype: Joi.string().required()
    }
  },
  handler: function(request, reply) {

    // Create a new user, this is the place where you add firstName, lastName etc.
    // Just don't forget to add them to the validator above.
    var newUser = new User({
      email: request.payload.email,
      usertype: request.payload.usertype  
    });

    // The register function has been added by passport-local-mongoose and takes as first parameter
    // the user object, as second the password it has to hash and finally a callback with user info.
    User.register(newUser, request.payload.password, function(err, user) {

      // Return error if present
      if (err) {
        return reply(err);
      }

      console.log('registered');
      return reply.redirect('/login');
    });
  }
};


