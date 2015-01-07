# ready-base

A simple mechanism that supports `jquery-like` ready staff. It is
useful when the process of instance initialization is async. Note that
if `.ready` is called after initialization, the callback is called
immediately.

# Install

`npm install ready-base`

# Quick Start

```javascript
  var util = require('util');
  var ReadyBase = require('ready-base');

  function MyClass() {
    ReadyBase.call(this);

    var self = this;
    setTimeout(function() {
      self.emit('ready');
    }, 1000);
  }
  util.inherits(MyClass, ReadyBase);

  var instance = new MyClass();

  // promise
  instance.ready()
    .then(function() {
      console.log('ready');
    });

  // or callback
  instance.ready(function() {
    console.log('ready');
  });

  // or event
  instance.on('ready', function() {
    console.log('ready');
  });

```

# Lisence

MIT

