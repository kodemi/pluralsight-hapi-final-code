var Hapi = require('hapi'),
    CardStore = require('./lib/cardStore'),
    UserStore = require('./lib/userStore');

var server = new Hapi.Server();

CardStore.initialize();
UserStore.initialize();

server.connection({ port: 3000 });

server.ext('onPreResponse', function (request, reply) {
    if (request.response.isBoom) {
        return reply.view('error', request.response);
    }
    reply.continue();
});

var goodOptions = {
    ops: {
        interval: 5000
    },
    reporters: {
        ops: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ ops: '*' }]
            },
            {
                module: 'good-squeeze',
                name: 'SafeJson'
            },
            {
                module: 'rotating-file-stream',
                args: ['hapi-process', { path: './logs', interval: '1d' }]
            }],
        response: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ response: '*' }]
            },
            {
                module: 'good-squeeze',
                name: 'SafeJson'
            },
            {
                module: 'rotating-file-stream',
                args: ['hapi-response', { path: './logs', interval: '1d' }]
            }],
        error: [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ error: '*' }]
            },
            {
                module: 'good-squeeze',
                name: 'SafeJson'
            },
            {
                module: 'rotating-file-stream',
                args: ['hapi-error', { path: './logs', interval: '1d' }]
            }]
    }
};

var plugins = [
    require('inert'),
    require('vision'),
    require('hapi-auth-cookie'),
    {
        register: require('good'),
        options: goodOptions
    }];

server.register(plugins, function (err) {
    if (err) { console.log(err); }
    server.views({
        engines: {
            html: require('handlebars')
        },
        path: './templates'
    });

    server.auth.strategy('default', 'cookie', {
        password: 'minimum-32-characters-password1234567890', // min 32 characters required https://github.com/hapijs/hapi/issues/3040
        redirectTo: '/login',
        isSecure: false
    });
    server.auth.default('default');
});

server.route(require('./lib/routes'));

server.start(function () {
    console.log('Listening on ' + server.info.uri);
});