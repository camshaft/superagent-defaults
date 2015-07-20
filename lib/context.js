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


// setup methods for context

each(protoMethods, function(method) {
  // blacklist unsupported functions
  if (~['end'].indexOf(method)) return;

  Context.prototype[method] = function() {
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

Context.prototype.applyStack = function(req) {
  this.stack.forEach(function(operation) {
    req[operation.method].apply(req, operation.args);
  });
};

// generate HTTP verb methods

each(methods, function(method) {
  var name = 'delete' == method ? 'del' : method;

  method = method.toUpperCase();
  Context.prototype[name] = function(url, fn) {
    var req;
    
    if (this.request instanceof Function) {
      req = this.request(method, url);
    } else {
      req = this.request[method.toLowerCase()](url);
    }

    // Do the attaching here
    this.applyStack(req);

    // Tell the listeners we've created a new request
    this.emit('request', req);

    fn && req.end(fn);
    return req;
  };
});

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
