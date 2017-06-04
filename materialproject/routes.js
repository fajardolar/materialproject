var Pages = require('./controllers/pages');
var Authentication = require('./controllers/authentication');

/**
 * Contains the list of all routes, i.e. methods, paths and the config functions
 * that take care of the actions
 */
exports.endpoints = [
	{ method: 'GET',    path: '/',               	config: Pages.login     },
	{ method: 'GET',    path: '/login',          	config: Pages.login    },
	{ method: 'GET',    path: '/edit',          	config: Pages.edit    },
	{ method: 'GET',    path: '/forgotpassword', 	config: Pages.forgotpassword },
	{ method: 'GET',    path: '/register',       	config: Pages.register },
	{ method: 'GET',    path: '/profile', 			config: Pages.secret   },
	{ method: 'GET',    path: '/confirm', 			config: Authentication.confirm   },

	{ method: 'POST',    path: '/profile', 			config: Authentication.secret   },
	{ method: 'POST',   path: '/edit',       	config: Authentication.edit },
	{ method: 'POST',   path: '/login',           	config: Authentication.login },
	{ method: 'GET',    path: '/logout',         	config: Authentication.logout },
	{ method: 'POST',   path: '/register',       	config: Authentication.register }
];

  // { method: ['GET', 'POST'], path: '/login', config: { handler: login, auth: { mode: 'try' }, plugins: { 'hapi-auth-cookie': { redirectTo: false } } } },