superagent-defaults [![Build Status](https://travis-ci.org/camshaft/superagent-defaults.png)](https://travis-ci.org/camshaft/superagent-defaults)
===================

Create some defaults for superagent requests

Usage
-----

```js
var defaults = require('superagent-defaults');

// Create a defaults context
var superagent = defaults();

// Setup some defaults
superagent
  .set('my-default-header', 'my-default-value')
  .auth('myUsername', 'myPassword')
  .on(function (req){
    console.log(req.url);
  });

// Use superagent like you always have; the defaults will be applied to
// each request automatically
superagent
  .get('/my-api')
  .end(function(res) {
    console.log(res.text);
  });
```

You may also pass a function that implements the superagent interface.

```js
var defaults = require('superagent-defaults');
var supertest = require('supertest');

var request = defaults(supertest(app));

request
  .get('/my-test-path')
  .end(function(err, res) {
    console.log(res.text);
  });
```

Tests
-----

```sh
$ npm test
```
