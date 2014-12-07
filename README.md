# Tiny jquery module system
[![Build Status](https://travis-ci.org/sanlyfang/jsmodule.svg?branch=master)](https://travis-ci.org/sanlyfang/jsmodule)

A simple library for better structuring javascript code w/o introducing big framework

It supports ONLY features that are considered crucial to start writing modular javascript code.

## Key features
* A clean way to define and use module without cluttering global namespace
* Support for default module settings and allow the values to be overridden
* For view module, client can specify container DOM element
   * event selectors are scoped to the container DOM
   * selectors in module can search from this parent element
* For view module, provides a mechanism to map event handlers to methods
   * single place to view all event mappings for the module
   * event handlers are executed in the proper context, "this" always refers to the object instead of DOM
   * event selectors are always scoped to the container DOM if available
* A simple mechanism for pub/sub
   * [jQuery Tiny Pub/Sub](https://github.com/cowboy/jquery-tiny-pubsub) is included because it's also tiny
   * same event mapping mechanism for topic subscribing

## Examples

### Basic example

```javascript
$.module({
    // Omit defaults & init method in this example to keep it simple
    events: {
        'click .btn-send': 'sendMsg',
        'click .btn-clear': 'clearMsg'
    },
    sendMsg: function() {
        var msg = $('#msgInput').val();
        $('#msg').text(msg);
    },
    clearMsg: function() {
        $('#msg').text('');
    }
})();
```

* For more complex example, have a look at [example-full.html](example/example-full.html)
* Check [example-pubsub.html](example/example-pubsub.html) to see how pub/sub works
