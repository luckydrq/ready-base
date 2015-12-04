/**!
 * ready-base - index.js
 *
 * @author luckydrq<drqzju@gmail.com>
 */

'use strict';
/**
 * Module Dependencies
 */
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Promise = require('native-or-bluebird');
var defer = process.nextTick || setImmediate;

function ReadyBase() {
  EventEmitter.call(this);

  this._ready = false;

  var self = this;
  this.on('ready', function() {
    self._ready = true;
  });

  defer(function() {
    if (!self.listeners('error').length) {
      self.on('error', defaultErrorHandler);
    }
  });
}

util.inherits(ReadyBase, EventEmitter);

// fix release Zalgo
// @see http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony
ReadyBase.prototype.ready = function(callback) {
  var self = this;
  if (this._ready) {
    if (arguments.length === 0) {
      return Promise.resolve();
    } else {
      return process.nextTick(function() {
        return callback.call(self);
      });
    }
  } else {
    if (arguments.length === 0) {
      var d = Promise.defer();
      this.on('ready', function() {
        d.resolve();
      });
      return d.promise;
    } else {
      return this.on('ready', function() {
        process.nextTick(function() {
          return callback.call(self);
        });
      });
    }
  }
};

function defaultErrorHandler(err) {
  if (!(err instanceof Error)) {
    return;
  }

  var SEPARATOR = ': ';

  // print err.name and err.message
  console.error([err.name, err.message].join(SEPARATOR));

  // print additional info
  var additionalInfo = '';
  for (var prop in err) {
    if (['name', 'message', 'stack'].indexOf(prop) === -1) {
      additionalInfo += [prop, err[prop]].join(SEPARATOR) + '\n';
    }
  }
  if (additionalInfo) {
    console.error('additional info: ');
    console.error(additionalInfo);
  }

  // print err.stack
  console.error(err.stack);
}

module.exports = ReadyBase;
