/**
 * Module dependencies
 */
var should = require('should')
  , context = require('..');

describe('superagent-context', function() {

  var superagent;

  beforeEach(function() {
    superagent = context();
  });

  it('should apply default headers', function() {
    superagent
      .set({'foo': 123})
      .set({'bar': 456});

    var req = superagent.get('/');

    req.request()._headers.foo.should.equal(123);
    req.request()._headers.bar.should.equal(456);
  });

  it('should emit `request` events', function(done) {
    superagent
      .on('request', function(req) {
        req.url.should.eql('/this/is/the/path');
        done();
      });

    var req = superagent.get('/this/is/the/path');
  });

});
