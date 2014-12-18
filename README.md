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

```javascript
$.module({
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

## How to test your module

By default, module is saved as global variable so that it can be accessed directly
in unit test code or browser console for easy debugging.

The variable name is resolved using the rules below:
* If id is available in the options, use it as variable name
* If id is not there, use module name
* If both are not specified, the module won't be saved to global
* nested path is supported for better organizing your modules

### Examples

```javascript
$.module('mysite.homepage.banner', {
    ...
})();

// use module name
console.log(mysite.homepage.banner);

$.module({
    ...
})(id: 'mysite.homepage.promo');

// id override module name
console.log(mysite.homepage.promo);

// list all modules on homepage
console.log(mysite.homepage);
```

If you don't like this feature, disable it:

```javascript
$.moduleSettings({putToGlobal: false});
```

## Drupal support
Use [jsmodule-drupal7.js](dist/jsmodule-drupal7.js) instead of [jsmodule.js](dist/jsmodule.js)
if you want to use this library in Drupal.

At the moment, only Drupal 7 is supported, a quick summary on the features:
* Integrate with Drupal behavior API so that context and settings are passed into the module
* Make sure you can write your module in non-drupal environment for quick mockup and later copy code to drupal site w/o any change
