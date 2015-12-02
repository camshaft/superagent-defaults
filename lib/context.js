/**
 * Module dependencies.
 */

var request = require('superagent');
var methods = require('./methods');
var protoMethods = Object.keys(request.Request.prototype);

/**
 * Expose `Context`.
 */

module.exports = Context;

/**
 * Initialize a new `Context`.
 *
 * @api public
 */

function Context(superagent) {
  if (!(this instanceof Context)) return new Context(superagent);
  this.request = superagent || request;
  this.stack = []; // store the default operation on the context
}
var proto = Context.prototype = {};

// setup methods for context

each(protoMethods, function(method) {
  // blacklist unsupported functions
  if (~['end'].indexOf(method)) return;

  proto[method] = function() {
    this.stack.push({
      method: method,
      args: arguments
    });

    return this;
  }
});

/**
 * apply the operations on the context to real Request instance
 *
 * @api private
 */

proto.applyStack = function(req) {
  this.stack.forEach(function(operation) {
    req[operation.method].apply(req, operation.args);
  });
};

// generate HTTP verb methods

each(methods, function(method) {
  var targetMethod = method == 'delete' ? 'del' : method;
  var httpMethod = method.toUpperCase();
  proto[method] = function(url, fn) {
    var r = this.request;
    var req = r instanceof Function ?
      r(httpMethod, url) :
      r[targetMethod](url);

    // Do the attaching here
    this.applyStack(req);

    // Tell the listeners we've created a new request
    this.emit('request', req);

    fn && req.end(fn);
    return req;
  };
});

proto.del = proto['delete'];

/**
 * Iterate array-ish.
 *
 * @param {Array|Object} arr
 * @param {Function} fn
 * @api private
 */

function each(arr, fn) {
  for (var i = 0; i < arr.length; ++i) {
    fn(arr[i], i);
  }
}
