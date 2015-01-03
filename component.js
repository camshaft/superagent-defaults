/**
 * Module dependencies
 */

var Context = require('./lib/context');
var Emitter = require('emitter');

/**
 * Mixin the emitter
 */

Emitter(Context.prototype);
