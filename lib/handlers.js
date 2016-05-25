var uuid = require('uuid'),
    fs = require('fs'),
    Joi = require('joi'),
    Boom = require('boom'),
    CardStore = require('./cardStore'),
    UserStore = require('./userStore');
    
var mailClient = require('sendgrid')('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'); // Change this to your API KEY
    
var cardSchema = Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    recipient_email: Joi.string().email().required(),
    sender_name: Joi.string().min(3).max(50).required(),
    sender_email: Joi.string().email().required(),
    card_image: Joi.string().regex(/.+\.(jpg|bmp|png|gif)\b/).required()
});

var loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(32).required()
});

var registerSchema = Joi.object().keys({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(32).required()
});

var Handlers = {};

Handlers.newCardHandler = function(request, reply) {
    if (request.method === 'get') {
        reply.view('new', { card_images: mapImages() });
    } else {
        Joi.validate(request.payload, cardSchema, function(err, val) {
            if (err) {
                return reply(Boom.badRequest(err.details[0].message));
            }
            var card = {
                name: val.name,
                recipient_email: val.recipient_email,
                sender_name: val.sender_name,
                sender_email: val.sender_email,
                card_image: val.card_image
            };
            saveCard(card);
            reply.redirect('/cards');
        });
    }
}

Handlers.cardsHandler = function(request, reply) {
    reply.view('cards', { cards: getCards(request.auth.credentials.email) });
}

Handlers.deleteCardHandler = function(request, reply) {
    delete CardStore.cards[request.params.id];
    reply();
}

Handlers.loginHandler = function(request, reply) {
    Joi.validate(request.payload, loginSchema, function(err, val) {
        if (err) {
            return reply(Boom.unauthorized('Credentials did not validate.'));
        }
        UserStore.validateUser(val.email, val.password, function(err, user) {
            if (err) {
                return reply(err);
            }
            request.cookieAuth.set(user);
            reply.redirect('/cards');
        });
    });
}

Handlers.logoutHandler = function(request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
}

Handlers.registerHandler = function(request, reply) {
    Joi.validate(request.payload, registerSchema, function(err, val) {
        if (err) {
            return reply(Boom.badRequest('Credentials did not validate.'));
        }
        UserStore.createUser(val.name, val.email, val.password, function(err) {
            if (err) {
                return reply(err);
            }
            reply.redirect('/cards');
        });
    });
}

Handlers.uploadHandler = function(request, reply) {
    var image = request.payload.upload_image;
    if (image.bytes) {
        fs.link(image.path, 'public/images/cards/' + image.filename, function() {
            fs.unlink(image.path);
        });
    }
    reply.redirect('/cards');
}

Handlers.sendCardHandler = function(request, reply) {
    var card = CardStore.cards[request.params.id];
    request.server.render('email', card, function(err, rendered) {
        mailClient.send({
            to: card.recipient_email,
            toname: card.name,
            from: card.sender_email,
            fromname: card.sender_name,
            subject: 'A greeting from hapi Greetings',
            html: rendered
        }, function(err, json) {
            if (err) {
                console.log(err);
            } else {
                console.log(json);
                reply.redirect('/cards');
            }           
        });
    });
}

Handlers.cardHandler = function(request, reply) {
    var card = CardStore.cards[request.params.id];
    return reply.view('card', card);
}

function mapImages() {
    return fs.readdirSync('./public/images/cards');
}

function saveCard(card) {
    var id = uuid.v1();
    card.id = id;
    CardStore.cards[id] = card;
}

function getCards(email) {
    var cards = [];
    for(var key in CardStore.cards) {
        if (CardStore.cards[key].sender_email === email) {
            cards.push(CardStore.cards[key]);
        }
    }
    return cards;
}

module.exports = Handlers;