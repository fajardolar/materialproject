/**
 * Handles a call to / and shows some text with links to login and registration
 */
exports.index = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			return reply.redirect('/profile');
		}

		return reply.view('index');
	}
};


/**
 * Handles a call to /login and shows a login form
 */
exports.login = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			return reply.redirect('/profile');
		}

   		return reply.view('login',  { user: {  admin: false }});
	}
};

/**
 * Handles a call to /register and shows a forgotpassword form
 */
exports.forgotpassword = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			return reply.redirect('/profile');
		}

		return reply.view('forgotpassword');
	}
};

/**
 * Handles a call to /register and shows a editprofile form
 */
exports.edit = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {


	if (!request.auth.isAuthenticated) {
			return reply.redirect('/edit ');
		}


	return reply.view('edit', { user: {  admin: true }, email : request.auth.credentials.email, password: request.auth.credentials.password});


	}
};




/**
 * Handles a call to /register and shows a registration form
 */
exports.register = {
	auth: {
		mode: 'try',
		strategy: 'session'
	},
	handler: function (request, reply) {

		if (request.auth.isAuthenticated) {
			return reply.redirect('/profile');
		}

		return reply.view('register',{ register_form: [{  name_label: "First Name", value : "first_name" }, {  name_label: "Last Name", value : "last_name" },
		{  name_label: "Project Name", value : "project_name" }, {  name_label: "Requestor Name", value : "requestor_name" },
		{  name_label: "Area Name", value : "area_name" }, {  name_label: "Email", value : "email" }, {  name_label: "Password", value : "password" }], 
		user_type : [{usertype_name : "SRS Coordinator"}, {usertype_name : "Purchasing"}, {usertype_name : "Opertions Boss"}]});
	}
};

/**
 * Handles a call to /batmanshideout and shows super secret stuff
 */
exports.secret = {
	auth: 'session',
	handler: function (request, reply) {	
	
	if (!request.auth.isAuthenticated) {
			// The user is already logged in, redirect it to the hideout
			return reply.redirect('/login ');
		}
	

		//Fetch all data from mongodb User Collection
        // Material.find({}, function (error, data) {
        //     if (error) {
        //         reply({
        //             statusCode: 503,
        //             message: 'Failed to get data',
        //             data: error
        //         });
        //     } else {
        //     	// return reply.view('secrethideout', data.material	);
        //     	console.log(data[0].material_id)
        //         reply({
        //             statusCode: 200,
        //             message: 'User Data Successfully Fetched',
        //             data: data
        //         });
        //         // console.log(data)

        //     }
        // });

    //      Material.find({}, function(err, data) {
		  //   if (err) {
			 //    //always handle errors here :)
			 //  }
			 //  if (data) {
			 //    //You can access the objectId of the employee like
			 //    console.log(data._id);
			 //    var news = data._id;
			 //     reply({
    //                 statusCode: 200,
    //                 message: 'User Data Successfully Fetched',
    //                 data: news
    //             });
		 	//  }			
		 
		    
	    	var objDate = new Date(),
		    locale = "en-us",
		    month = objDate.toLocaleString(locale, { month: "long" });
			day = objDate.getUTCDate();
			year = objDate.getUTCFullYear();
			var date = month + " " + day + ", " + year;
			console.log(request.auth.credentials.usertype)

		  return reply.view('profile',  { name: request.auth.credentials.firstname + " " + request.auth.credentials.lastname, usertype : request.auth.credentials.usertype, user: {  admin: true }, projects : {project_name : request.auth.credentials.projectname, requestor_name : request.auth.credentials.firstname + " " + request.auth.credentials.lastname,
		  								area_name : request.auth.credentials.areaname, date : date}});


	
	
		
	}
};
