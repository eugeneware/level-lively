var LivelyDb = require('livelydb'),
    clone = require('clone'),
    diff = require('changeset'),
    setImmediate = global.setImmediate || process.nextTick,
    inherits = require('util').inherits;

module.exports = LevelLively;
function LevelLively(db) {
  LivelyDb.call(this);
  this.db = db;
}
inherits(LevelLively, LivelyDb);

LevelLively.prototype.get = function (key, cb) {
  this.db.get(key, cb);
};

LevelLively.prototype.put = function (key, value, cb) {
  var self = this;
  this.get(key, function (err, old) {
    if (err && !err.notFound) return cb(err);
    var changes;
    try {
      changes = diff(old, value);
    } catch (e) {
      changes = [];
    }
    self.db.put(key, value, function (err) {
      if (err) return cb(err);
      if (changes.length) self.emit('change', key, changes);
      cb();
    });
  });
}

LevelLively.prototype.del = function (key, cb) {
  this.db.del(key, cb);
}
