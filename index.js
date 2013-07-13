/**
 * Module dependencies.
 */

require = require('require-component')(require);

var request = require('superagent')
  , Emitter = require('emitter')
  , methods = require('methods', './methods');
 
/**
 * Expose `Context`.
 */
 
module.exports = Context;
 
/**
 * Initialize a new `Context`.
 *
 * @api public
 */
 
function Context() {
  if (!(this instanceof Context)) return new Context;
  this.headers = [];
}
 
/**
 * Inherit from `Emitter`
 */
 
Emitter(Context.prototype);
 
/**
 * Add a default header to the context
 * 
 * @api public
 */
 
Context.prototype.set = function() {
  this.headers.push(arguments);
  return this;
}
 
/**
 * Set the default headers on the req
 * 
 * @api private
 */
 
Context.prototype.applyHeaders = function(req) {
  each(this.headers, function(header) {
    req.set.apply(req, header);
  });
}
 
// generate HTTP verb methods
 
each(methods, function(method){
  var name = 'delete' == method ? 'del' : method;
 
  method = method.toUpperCase();
  Context.prototype[name] = function(url, fn){
    var req = request(method, url);
 
    // Do the attaching here
    this.applyHeaders(req);
    
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
