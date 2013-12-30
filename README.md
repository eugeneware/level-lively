# level-lively

Levelup/Leveldb implementation of LivelyDb for doing real-time data binding of a database with local javascript objects.

Just one of multiple database implementations for the livedb real-time
data-binding framework for replicating databases to local javascript objects.

[![build status](https://secure.travis-ci.org/eugeneware/level-lively.png)](http://travis-ci.org/eugeneware/level-lively)

## Installation

This module is installed via npm:

``` bash
$ npm install level-lively
```

## Example Usage

``` js
var levelLively = require('level-lively');
```

## Example Usage

``` js
var LevelLively = require('level-lively');
var level = require('level');
var db = level('/path/to/db', { valueEncoding: 'json' });

// Write to the levelup database
var ldb = new LevelLively(db);
ldb.put('my key', 'my value, function (err) {
  // I/O or other error, pass it up the callback chain
  if (err) return callback(err);
});

// Read from the memory database
ldb.get('my key', function (err, value) {
  if (err) {
    if (err.notFound) {
      // handle not found error
      return;
    } else {
      // I/O or other error, pass it up the callback chain
      return callback(err);
    }
  }
});

// Delete from the memory database
ldb.del('my key', function (err) {
  // I/O or other error, pass it up the callback chain
  if (err) return callback(err);
});
```
