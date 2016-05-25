'use strict'
const Handlers = require('./handlers');

const Routes = [
    {
        path: '/',
        method: 'GET',
        handler: {
            file: 'templates/index.html'
        },
        config: {
            auth: false
        }
    },
    {
        path: '/assets/{path*}',
        method: 'GET',
        handler: {
            directory: {
                path: './public',
                listing: false
            }
        },
        config: {
            auth: false
        }
    },
    {
        path: '/cards/new',
        method: ['GET', 'POST'],
        handler: Handlers.newCardHandler
    },
    {
        path: '/cards',
        method: 'GET',
        handler: Handlers.cardsHandler
    },
    {
        path: '/cards/{id}',
        method: 'GET',
        handler: Handlers.cardHandler
    },
    {
        path: '/cards/{id}',
        method: 'DELETE',
        handler: Handlers.deleteCardHandler
    },
    {
        path: '/cards/{id}/send',
        method: 'GET',
        handler: Handlers.sendCardHandler
    },
    {
        path: '/login',
        method: 'GET',
        handler: {
            file: 'templates/login.html'
        },
        config: {
            auth: false
        }
    },
    {
        path: '/login',
        method: 'POST',
        handler: Handlers.loginHandler,
        config: {
            auth: false
        }
    },
    {
        path: '/logout',
        method: 'GET',
        handler: Handlers.logoutHandler
    },
    {
        path: '/register',
        method: 'GET',
        handler: {
            file: 'templates/register.html'
        },
        config: {
            auth: false
        }
    },
    {
        path: '/register',
        method: 'POST',
        handler: Handlers.registerHandler,
        config: {
            auth: false
        }
    },
    {
        path: '/upload',
        method: 'GET',
        handler: {
            file: 'templates/upload.html'
        }
    },
    {
        path: '/upload',
        method: 'POST',
        handler: Handlers.uploadHandler,
        config: {
            payload: {
                output: 'file',
                uploads: 'public/images'
            }
        }
    }
];

module.exports = Routes;