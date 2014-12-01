jsmodule
========

A simple library for better structuring javascript code w/o introducing big framework

It supports ONLY features that are considered crucial to start writing modular javascript code.

* A clean way to define and use module without cluttering global namespace
* Support for default module settings and allow the values to be overridden
* For view module, client can specify container DOM element
   * event selectors are scoped to this container DOM
   * selectors in module can search from this parent element
* For view module, provides a mechanism to map event handlers to methods
   * single place to view all event mappings for the module
   * event handlers are executed in the proper context, "this" always refers to the object instead of DOM
   * event selectors are always scoped to the container DOM if available
    
For full example, have a look at 'example-full.html'

For quick start without any need to reuse your module, go to 'example-simple.html' for a quick check

All the examples are self-explanatory.
