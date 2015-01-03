/**
 * Module dependencies
 */

var Context = module.exports = require('./lib/context');
var Emitter = require('emitter-component');

/**
 * Mixin the emitter
 */

Emitter(Context.prototype);
