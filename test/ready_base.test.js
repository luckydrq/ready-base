/**!
 * nunjucks engine - test/ready_base.test.js
 *
 * @author luckydrq<drqzju@gmail.com>
 */

'use strict';
/**
 * Module Dependencies
 */
var assert = require('assert');
var ReadyBase = require('..');

describe('ready-base test', function() {
  it('should return promise when no args passed in #ready', function() {
    var instance = new ReadyBase();
    var result = instance.ready();
    assert.ok('function' === typeof result.then);
  });

  it('should return promise when it already ready', function() {
    var instance = new ReadyBase();
    instance.emit('ready');
    var result = instance.ready();
    assert.ok('function' === typeof result.then);
  });

  it('should not ready when passed a function', function() {
    var i = 0;
    var instance = new ReadyBase();
    var result = instance.ready(function() {
      ++i;
    });
    assert.ok(i === 0);
  });

  it('should trigger ready callback when a ready event emitted', function(done) {
    var i = 0;
    var instance = new ReadyBase();
    var result = instance.ready(function() {
      ++i;
      assert.ok(i === 1);
      done();
    });
    assert.ok(i === 0);
    instance.emit('ready');
  });

  it('should trigger ready callbacks when a ready event emitted', function(done) {
    var i = 0;
    var instance = new ReadyBase();
    instance.ready(function() {
      ++i;
      assert.ok(i === 1);
    });
    instance.ready(function() {
      i += 2;
      assert.ok(i === 3);
      done();
    });
    assert.ok(i === 0);
    instance.emit('ready');
  });

  it('should execute callback asyncly when instance is already ready', function(done) {
    var i = 0;
    var instance = new ReadyBase();
    instance.emit('ready');
    instance.ready(function() {
      assert.ok(i === 0);
      ++i;
      done();
    });
  });
});
