(function($) {
	"use strict";

	var modules = {};

	var defineModule = function(name, prototype) {
		var module = function(options) {
			// Merge user options with defaults
			this.settings = $.extend({}, this.defaults, options);

			// Cache container element if provided
			if (this.settings.el) {
				this.$el = $(this.settings.el);
			}

			// Register event handlers if provided, make sure "this" always refers to current object instead of DOM
			for (var e in this.events) {
				var parts = $.trim(e).match(/^(\S+)\s*(.*)$/);
				var eventName = parts[1];
				var selector = parts[2];
				var handler = this.events[e];
				
				var target = this.$el || $(document);
				if (selector) target = target.find(selector);
				target.on(eventName, this[handler].bind(this));
			}

			// Initialize
			if (typeof(this.init) == 'function') {
				this.init();
			}
		};
			
		module.prototype = prototype;
		modules[name] = module;
		return module;
	}

	var module = function() {
		if (arguments.length == 1) {
			return modules[arguments[0]];
		} else if (arguments.length == 2) {
			return defineModule(arguments[0], arguments[1]);
		}
	}

	$.extend({
		module : module
	});
})(jQuery);
