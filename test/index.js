var LivelyDb = require('livelydb'),
    level = require('level'),
    LevelLively = require('..'),
    expect = require('expect.js'),
    path = require('path'),
    rimraf = require('rimraf'),
    noop = function() { };

describe('LivelyDb', function() {
  var db, dbPath = path.join(__dirname, '..', 'data', 'testdb');
  var ldb;
  beforeEach(function(done) {
    rimraf.sync(dbPath);
    db = level(dbPath, { keyEncoding: 'utf8', valueEncoding: 'json' });
    ldb = new LevelLively(db);
    done();
  });

  afterEach(function(done) {
    db.close(done);
  });

  it('should be able to create a LevelLively DB', function(done) {
    expect(ldb).not.to.be(undefined);
    done();
  });

  it('should be able to put and get values', function(done) {
    var key = 'my key';
    var value = 'my value';

    ldb.put(key, value, get);

    function get(err) {
      if (err) return done(err);
      ldb.get(key, check);
    }

    function check(err, data) {
      if (err) return done(err);
      expect(data).to.equal(value);
      done();
    }
  });

  it('should handle not found errors', function(done) {
    ldb.get('no key', function (err, data) {
      expect(err.notFound).to.equal(true);
      expect(err.name).to.equal('NotFoundError');
      done();
    });
  });

  it('should be able to delete keys', function(done) {
    var key = 'my key';
    var value = 'my value';

    ldb.put(key, value, del);

    function del(err) {
      if (err) return done(err);
      ldb.del(key, get);
    }

    function get(err) {
      if (err) return done(err);
      ldb.get(key, check);
    }

    function check(err, data) {
      expect(err.notFound).to.equal(true);
      done();
    }
  });

  it('should emit change events', function(done) {
    var key = 'eugene';
    var value = { name: 'Eugene', number: 42 };

    var count = 0;
    ldb.on('change', function (key_, change) {
      expect(key_).to.equal(key);
      if (count === 0) {
        expect(change).to.eql([
          { type: 'put', key: [], value: { name: 'Eugene', number: 42 } } ]);
      } else if (count === 1) {
        expect(change).to.eql([
          { type: 'put', key: [ 'name' ], value: 'Susan' },
          { type: 'del', key: [ 'number' ] } ]);
        done();
      }
      count++;
    });

    ldb.put(key, value, change);

    function change(err) {
      if (err) return done(err);
      value.name = 'Susan';
      delete value.number;
      ldb.put(key, value, noop);
    }
  });
});

