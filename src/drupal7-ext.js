/*
 * module.js extension to integrate with drupal 7 behavior API
 */
(function ($) {
    'use strict';

    if (typeof Drupal === 'undefined') return;

    var module = $.module;
    $.module = function (name, prototype) {
        if (arguments.length != 2) {
            throw 'invalid parameters, usage: $.module(name, prototype)';
        }

        var Module = module(name, prototype);

        return function (options) {
            options = options || {};
            var globalId = options.id || name;

            Drupal.behaviors[globalId] = {
                attach: function (context, settings) {
                    options = $.extend({}, settings[globalId], options);
                    options.el = options.el || context;

                    new Module(options);
                }
            };
        };
    };
})(jQuery);
