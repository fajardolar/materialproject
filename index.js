'use strict';

const Hapi = require('hapi');
var Routes = require('./routes');

const server = new Hapi.Server();
server.connection({ port: "8001"});


server.register([require('hapi-auth-cookie'), require('vision'), require('inert')], (err) => {

    if (err) {
        throw err;
    }

    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;

    server.auth.strategy('session', 'cookie',  {
        password: 'password-should-be-32-characters',
        cookie: 'sessions',
        isSecure: false, // required for non-https applications
        ttl: 24* 60 * 60 * 1000
       
    });

     server.views({  
        engines: {
                    html: require('handlebars')
                },
                path: 'views',
                layoutPath: 'views/layout',
                layout: 'default',
                partialsPath: 'views/partials'
    });

    server.route({
        method : 'GET', 
        path : '/public/{path*}', 
        handler : {
            directory : {
                path : './public',
                listing : false,
                index : false
            }
        }
    });

    // Print some information about the incoming request for debugging purposes
    server.ext('onRequest', function (request, reply) {
        console.log(request.path, request.query);
        return reply.continue();
    });


    server.route(Routes.endpoints);

    server.start(() => {

        console.log('Server ready ' + server.info.port);
    });
});

