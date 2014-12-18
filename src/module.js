(function ($) {
    'use strict';

    // Global settings
    var moduleSettings = {
        putToGlobal: true
    };

    var modules = {};

    var eventHandler = function (module, handler) {
        var handlerFunc;

        if (typeof handler === 'function') {
            handlerFunc = handler;
        } else if (typeof module[handler] === 'function') {
            handlerFunc = module[handler];
        } else {
            throw 'invalid event handler: ' + handler;
        }
        return $.proxy(handlerFunc, module);
    };

    var initModule = function (options) {
        // Merge user options with defaults
        this.settings = $.extend({}, this.defaults, options);

        // Cache container element if provided
        if (this.settings.el) {
            var el = $(this.settings.el);
            if (el.length > 0) {
                this.$el = el;
            }
        }

        // Register event handlers if provided, make sure "this" always refers to current object instead of DOM
        for (var e in this.events) {
            var parts = $.trim(e).match(/^(\S+)\s*(.*)$/),
                eventName = parts[1],
                selector = parts[2],
                handler = this.events[e];

            if ($.subscribe && eventName.charAt(0) == '[' &&
                eventName.charAt(eventName.length - 1) == ']' && !selector) {
                $.subscribe(eventName.slice(1, -1), eventHandler(this, handler));
            } else {
                var target = this.$el || $(document);
                target.on(eventName, selector, eventHandler(this, handler));
            }
        }

        // Initialize
        if (typeof this.init === 'function') {
            this.init(this.settings);
        }
    };

    var putToGlobal = function (id, obj) {
        var paths = id.split('.'),
            parent = window;
        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (i < paths.length - 1) {
                parent = parent[path] || (parent[path] = {});
            } else {
                parent[path] = obj;
            }
        }
    };

    var defineModule = function (name, prototype) {
        var Module = function (options) {
            if (!(this instanceof Module)) {
                return new Module(options);
            }

            initModule.call(this, options);

            if (moduleSettings.putToGlobal) {
                var globalId = options && options.id || name;
                if (globalId) {
                    putToGlobal(globalId, this);
                }
            }
        };

        Module.prototype = $.extend({
            $: function (selector) {
                return $(selector, this.$el || $(document));
            }
        }, prototype);

        if (name) {
            modules[name] = Module;
        }

        return Module;
    };

    $.module = function () {
        if (arguments.length == 1) {
            var arg = arguments[0];
            return typeof arg === 'string' ? modules[arg] : defineModule(null, arg);
        } else if (arguments.length == 2) {
            return defineModule(arguments[0], arguments[1]);
        } else {
            throw 'wrong argument number: ' + arguments.length;
        }
    };

    $.moduleSettings = function (settings) {
        $.extend(moduleSettings, settings);
    };
})(jQuery);
