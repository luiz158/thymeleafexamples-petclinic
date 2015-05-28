module.exports = function(JSData) {

  var DSSqlAdapter = require('js-data-sql');
  var store = new JSData.DS();
  var adapter = new DSSqlAdapter({
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/../../../../../resources/db/sqlite3/petclinic.db'
    }
  });

  // the connection pool and query builder
  // see http://knexjs.org/
  adapter.query;

  var DS = new JSData.DS({
//    keepChangeHistory: false,
//    resetHistoryOnInject: false,
    cacheResponse: true,
//    ignoreMissing: true,
//    upsert: false,
//    bypassCache: true,
//    findInverseLinks: false,
    findHasMany: true,
    findBelongsTo: true,
    findHasOne: true,
//    notify: false,
    log: true
  });
  DS.registerAdapter('sql', adapter, { default: true });

  return DS;

}