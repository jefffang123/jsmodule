jsmodule
========

A simple library for better structuring javascript code w/o introducing big framework

It supports ONLY features that are considered crucial to start writing modular javascript code.

* A clean way to define and use module without cluttering the global namespace.
* Support for default settings for module, and allow the values to be overridden
* For view module, client can specify container DOM element
   * event selector are scoped to this container DOM
   * a base target for module selector to start searching
* For view module, provide mechanism to map event handler to method
   * centralize place to see all event mapping for the module
   * event handler are executed in the proper context, "this" always refers to the object instead of DOM
   * event selectors are always scoped to the container DOM if available
    
For full example, have a look at test.html   
