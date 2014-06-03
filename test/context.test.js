/**
 * Module dependencies
 */

var should = require('should');
var context = require('..');

describe('superagent-context', function() {

  var superagent;

  beforeEach(function() {
    superagent = context();
  });

  it('should apply default headers', function() {
    superagent
      .set({'foo': 123})
      .set({'bar': 456});

    var req = superagent.get('http://example.com');

    req.request()._headers.foo.should.equal(123);
    req.request()._headers.bar.should.equal(456);
  });

  it('should emit `request` events', function(done) {
    superagent
      .on('request', function(req) {
        req.url.should.eql('http://example.com/this/is/the/path');
        done();
      });

    var req = superagent.get('http://example.com/this/is/the/path');
  });

  it('should apply default auth', function() {
    superagent
      .auth('abc','cde');

    var req = superagent.get('http://example.com');
    var expectedAuthHeader = 'Basic ' + (new Buffer('abc:cde')).toString('base64');

    req.request()._headers.authorization.should.equal(expectedAuthHeader);
  });

  it('should accept an superagent-like interface in the context', function(done) {
    var interface = function(method, url) {
      done();
      return {
        set: function() {}
      };
    };

    superagent = context(interface);
    superagent.get('http://example.com');
  });
});
