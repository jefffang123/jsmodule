module('pubsub', {
    setup: function () {
        $.moduleSettings({putToGlobal: false});
    }
});

test('send message without args', function () {
    $.module({
        events: {
            '[userAdded-noargs]': 'userAdded'
        },

        userAdded: function () {
            equal(arguments.length, 1, 'correct argument number');
            equal(arguments[0].type, 'userAdded-noargs', 'first argument is event object');
        }
    })();
    $.publish('userAdded-noargs');
});

test('send message with args as array', function () {
    $.module({
        events: {
            '[userAdded-array]': 'userAdded'
        },

        userAdded: function (_, firstName, lastName) {
            equal(arguments.length, 3, 'correct argument number');
            equal(firstName, 'Jeff');
            equal(lastName, 'Fang');
        }
    })();
    $.publish('userAdded-array', ['Jeff', 'Fang']);
});

test('send message with args as object', function () {
    var user = {
        firstName: 'Jeff',
        lastName: 'Fang'
    };

    $.module({
        events: {
            '[userAdded-object]': 'userAdded'
        },

        userAdded: function (_, arg) {
            equal(arguments.length, 2, 'correct argument number');
            equal(arg, user, 'argument should match');
        }
    })();
    $.publish('userAdded-object', user);
});