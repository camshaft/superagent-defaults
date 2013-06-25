/**
 * Module dependencies.
 */
 
var request = require('superagent')
  , methods = require('methods')
  , each = require('each-component')
  , Emitter = require('emitter');
 
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
  each(this.headers, function(headerArgs) {
    req.set.apply(req, headerArgs);
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
