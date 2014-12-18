module('core', {
    setup: function () {
        $.moduleSettings({putToGlobal: false});
    }
});

test('module plugin is registered in global jquery object', function () {
    ok(typeof $.module === 'function', '$.module is available');
});

test('define module and create multiple instances', function () {
    var User = $.module('User', {});
    strictEqual(typeof User, 'function', 'module is returned as a constructor function');

    equal($.module('User'), User, 'module can be retrieved later');

    var user1 = new User();
    ok(user1 instanceof User, 'instanceof operator should work');

    var user2 = User();
    ok(user2 instanceof User, 'creating new instance using function call instead of new keyword');
    notEqual(user2, user1, 'instances are not shared');
});

test('define module and run right away', function () {
    var user = $.module({})();
    strictEqual(typeof user, 'object');
});

test('$.module parameter check', function () {
    throws(function () {
        $.module();
    }, 'wrong argument number: 0', 'detect error if no argument is provided');

    throws(function () {
        $.module('test', {}, {});
    }, 'wrong argument number: 3', 'detect error if more than two arguments are provided');
});

test('module fields and methods are accessible', function () {
    var user = $.module({
        name: 'Jeff',
        greeting: function () {
            return 'Hello ' + this.name;
        }
    })();

    equal(user.name, 'Jeff', 'can access field in module');
    equal(user.greeting(), 'Hello Jeff', 'can call method in module');
});

test('module settings', function () {
    var user = $.module({
        defaults: {
            name: 'Jeff',
            age: 35
        }
    });

    var user1 = user();
    deepEqual(user1.settings, {name: 'Jeff', age: 35}, 'get default settings w/o override');

    var user2 = user({age: 36, gender: 'M'});
    deepEqual(user2.settings, {name: 'Jeff', age: 36, gender: 'M'}, 'override default settings');

    var user3 = $.module({})();
    deepEqual(user3.settings, {}, "empty settings shouldn't cause issue");
});

test('module can be registered to global', function () {
    $.moduleSettings({putToGlobal: true});

    var user = $.module('example.user1', {});

    user();
    ok(example.user1 instanceof user, 'use module name to register module instance by default');

    user({id: 'example.user2'});
    ok(example.user2 instanceof user, 'if id is specified, use id to register module instance');

    deepEqual(Object.keys(example), ['user1', 'user2'], 'module instances are grouped into namespace');

    delete window.example;
});

test('this.$el', function () {
    var user = $.module({})();
    strictEqual(user.$el, undefined, 'el is optional');

    $('<div id="testdiv"/>').appendTo('#qunit-fixture');
    user = $.module({})({el: '#testdiv'});
    equal(user.$el.length, 1, 'can access $el if module is attached to dom');

    user = $.module({})({el: '#notexist'});
    strictEqual(user.$el, undefined, 'silently ignore el if it is not in dom');
});

test('this.$', function () {
    $('<div id="testdiv"><span class="msg"/></div><span class="msg"/>').appendTo('#qunit-fixture');
    var user = $.module({})({el: '#testdiv'});
    strictEqual(typeof user.$, 'function', 'this.$ should be a function');
    equal(user.$('.msg').length, 1, 'this.$(selector) is a shortcut of this.$el.find(selector)');

    user = $.module({})();
    strictEqual(typeof user.$, 'function', 'this.$ is also available if module is not attached to dom');
    equal(user.$('body').length, 1, 'if module is not attached to dom, this.$(selector) is same as $(selector)');
});

test('init method', function () {
    var user = $.module({})();
    strictEqual(user.init, undefined, 'init method is optional');

    user = $.module({init: true})();
    ok(user.init, 'ignore init if it is not a function');

    user = $.module({
        init: function (settings) {
            this.name = settings.name;
        }
    })({name: 'Jeff'});
    equal(user.name, 'Jeff', 'init method get called and settings are passed as argument');
});

test('events declaration', function () {
    $('<div id="testdiv"><button type="button">Submit</button><div class="custom"><span/></div></div><button type="button" id="secondBtn">Submit</button>').appendTo('#qunit-fixture');

    expect(6);
    $.module({
        events: {
            'click': 'clicked',
            'click button': 'btnClicked',
            'customEvent .custom span': 'customEvent',
            '  click   .custom  ': 'spaceIgnored',
            'anonymous': function () {
                ok(true, 'support anonymous function for event handler');
            }
        },

        clicked: function (e) {
            equal(e.type, 'click', 'event object is passed into the handler');
            equal(this.$el.length, 1, "in handler method, 'this' refers to current object instead of dom");
        },

        btnClicked: function () {
            ok(true, 'event selector should work');
            return false;
        },

        customEvent: function () {
            ok(true, 'custom event with multi-level selector');
        },

        spaceIgnored: function () {
            ok(true, 'space should be ignored in events declaration');
            return false;
        }
    })({el: '#testdiv'});

    $('#testdiv').trigger('click');
    $('#testdiv button').trigger('click');
    $('#testdiv .custom span').trigger('customEvent');
    $('#testdiv .custom').trigger('click');
    $('#secondBtn').trigger('click'); // This button is outside of container, so no effect.
    $('#testdiv').trigger('anonymous');
});

test('events registered to document if el not provided', function () {
    $.module({
        events: {
            'click': 'clicked'
        },

        clicked: function () {
            ok(true);
        }
    })();
    $(document).trigger('click')
        .off('click');  // has to manually reset because it's not inside fixture
});

test('event handler error detection', function () {
    $('<div id="testdiv"/>').appendTo('#qunit-fixture');

    throws(function () {
        $.module({
            events: {
                'click': 'clicked'
            }
        })({el: '#testdiv'});
    }, 'invalid event handler: clicked', 'detect invalid event handler and provide helpful error message');
});
