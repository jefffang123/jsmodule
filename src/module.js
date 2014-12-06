(function ($) {
    'use strict';

    var modules = {};

    var eventHandler = function (handler) {
        if (typeof handler == 'function') {
            return handler;
        } else if (typeof this[handler] == 'function') {
            return this[handler];
        } else {
            throw 'invalid event handler: ' + handler;
        }
    };

    var initModule = function (options) {
        // Merge user options with defaults
        this.settings = $.extend({}, this.defaults, options);

        // Cache container element if provided
        if (this.settings.el) {
            this.$el = $(this.settings.el);
            if (this.$el.length === 0) {
                throw 'el cannot be located in dom: ' + this.settings.el;
            }
        }

        // Register event handlers if provided, make sure "this" always refers to current object instead of DOM
        for (var e in this.events) {
            var parts = $.trim(e).match(/^(\S+)\s*(.*)$/),
                eventName = parts[1],
                selector = parts[2],
                handler = this.events[e];

            var target = this.$el || $(document);
            if (selector) {
                target = target.find(selector);
                if (target.length === 0) {
                    throw 'invalid event selector: ' + selector;
                }
            }
            target.on(eventName, $.proxy(eventHandler.call(this, handler), this));
        }

        // Initialize
        if (typeof this.init == 'function') {
            this.init(this.settings);
        }
    };

    var defineModule = function (name, prototype) {
        var Module = function (options) {
            if (!(this instanceof Module)) {
                return new Module(options);
            }

            initModule.call(this, options);
        };

        Module.prototype = prototype;
        if (name) modules[name] = Module;

        return Module;
    };

    var module = function () {
        if (arguments.length == 1) {
            var arg = arguments[0];
            return typeof arg == 'string' ? modules[arg] : defineModule(null, arg);
        } else if (arguments.length == 2) {
            return defineModule(arguments[0], arguments[1]);
        }
    };

    $.extend({
        module: module
    });
})(jQuery);
