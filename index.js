/**!
 * nunjucks engine - lib/engines/nunjucks/index.js
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

ReadyBase.prototype.ready = function(callback) {
  if (this._ready) {
    if (arguments.length === 0) {
      return Promise.resolve();
    } else {
      return callback.call(this);
    }
  } else {
    if (arguments.length === 0) {
      var self = this;
      var d = Promise.defer();
      this.on('ready', function() {
        d.resolve();
      });
      return d.promise;
    } else {
      return this.on('ready', callback);
    }
  }
};

module.exports = ReadyBase;
