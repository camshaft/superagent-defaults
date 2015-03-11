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

each(protoMethods, function(m) {
  if (methods.indexOf(m) > -1) { // m is a HttpVerb method , don't record operation
    return;
  }

  Context.prototype[m] = function() {
    this.stack.push({
      method: m,
      args: [].slice.call(arguments)
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
  this.stack.forEach(function(op){ // op -> operation
    req[op.method].apply(req,op.args);
  });
};

// generate HTTP verb methods

each(methods, function(method){
  var name = 'delete' == method ? 'del' : method;

  method = method.toUpperCase();
  Context.prototype[name] = function(url, fn){
    var req = this.request(method, url);

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
