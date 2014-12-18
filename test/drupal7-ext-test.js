module('drupal7-ext', {
    teardown: function () {
        Drupal.settings = {};
        Drupal.behaviors = {};
        delete window.example;
    }
});

test('$.module parameter check', function () {
    throws(function () {
        jQuery.module({});
    }, 'invalid parameters, usage: $.module(name, prototype)', 'only accept two parameters');
});

test('Drupal.behaviors integration', function () {
    var hello = jQuery.module('example.hello', {
        defaults: {
            name: 'User'
        },

        getText: function () {
            return 'Hello ' + this.settings.name;
        }
    });

    hello();
    hello({id: 'example.hello1', name: 'Jeff'});

    Drupal.attachBehaviors(document, Drupal.settings);

    equal(example.hello.getText(), 'Hello User', 'module is created and saved to global variable using module name by default');
    equal(example.hello1.getText(), 'Hello Jeff', 'id can be specified to override the default global variable name');
});

test('drupal context', function () {
    jQuery('<div id="testdiv"><span class="msg"/></div><span id="testspan" class="msg"/>').appendTo('#qunit-fixture');

    jQuery.module('example.user1', {})();
    Drupal.attachBehaviors();
    equal(example.user1.$('.msg').length, 2, 'drupal context default to document');

    jQuery.module('example.user2', {})();
    Drupal.attachBehaviors('#testdiv');
    equal(example.user2.$('.msg').length, 1, 'use drupal context as dom container if el is not specified');

    jQuery.module('example.user3', {})({el: '#testspan'});
    Drupal.attachBehaviors('#testdiv');
    equal(example.user3.$('.msg').length, 0, 'el should override drupal context');
});

test('drupal settings', function () {
    jQuery.module('example.user', {})();
    Drupal.settings['example.user'] = {
        name: 'Jeff'
    };
    Drupal.attachBehaviors();
    equal(example.user.settings.name, 'Jeff', 'drupal settings are passed into the module');

    jQuery.module('example.user', {})({id: 'example.user1'});
    Drupal.settings['example.user1'] = {
        name: 'Tony'
    };
    Drupal.attachBehaviors();
    equal(example.user1.settings.name, 'Tony', 'if id is specified, use id to find drupal settings for the module');

    jQuery.module('example.user2', {})({name: 'Jack'});
    Drupal.settings['example.user2'] = {
        name: 'Jeff'
    };
    Drupal.attachBehaviors();
    equal(example.user2.settings.name, 'Jack', 'module options should override drupal settings');
});
