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

function ReadyBase() {
  EventEmitter.call(this);

  this._ready = false;

  var self = this;
  this.on('ready', function() {
    self._ready = true;
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

module.exports = ReadyBase;
