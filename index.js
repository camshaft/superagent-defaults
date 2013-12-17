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
  this.authCredentials = {};
}
 
/**
 * Inherit from `Emitter`
 */
 
Emitter(Context.prototype);

/**
 * Set default auth credentials
 *
 * @api public
 */

Context.prototype.auth = function (user, pass) {
  this.authCredentials.user = user;
  this.authCredentials.pass = pass;
};
 
/**
 * Add a default header to the context
 * 
 * @api public
 */
 
Context.prototype.set = function() {
  this.headers.push(arguments);
  return this;
};
 
/**
 * Set the default headers on the req
 * 
 * @api private
 */
 
Context.prototype.applyHeaders = function(req) {
  each(this.headers, function(header) {
    req.set.apply(req, header);
  });
};
 
// generate HTTP verb methods
 
each(methods, function(method){
  var name = 'delete' == method ? 'del' : method;
 
  method = method.toUpperCase();
  Context.prototype[name] = function(url, fn){
    var req = request(method, url),
        auth = this.authCredentials;
 
    // Do the attaching here
    this.applyHeaders(req);

    // Call superagent's auth method
    if(auth.hasOwnProperty('user') && auth.hasOwnProperty('pass')) {
      req.auth(auth.user, auth.pass);
    }
    
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
