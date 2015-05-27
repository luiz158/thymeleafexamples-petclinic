module.exports = function(JSData) {

  var config = {
    API_DB_HOST: "localhost",
    API_DB_PORT: 28015,
    API_DB_DATABASE: "petclinic",
    API_DB_AUTH_KEY: "fish"
  };
  
  var DSRethinkDbAdapter = require('js-data-rethinkdb');
  
  var rethinkdbAdapter = new DSRethinkDbAdapter({
    host: config.API_DB_HOST,
    port: config.API_DB_PORT,
    db: config.API_DB_DATABASE,
    authKey: config.API_DB_AUTH_KEY,
  //  min: 1,
    max: 5,
    buffer: 2//,
  //  timeout: 60//,
  //  bufferSize: 2
  //  min: 10,
  //  max: 50
  });
  
  var DS = new JSData.DS({
  //  keepChangeHistory: false,
  //  resetHistoryOnInject: false,
    cacheResponse: true,
  //  ignoreMissing: true,
  //  upsert: false,
  //  bypassCache: true,
  //  findInverseLinks: false,
    findHasMany: true,
    findBelongsTo: true,
    findHasOne: true,
  //  notify: false,
    log: true
  });
  DS.registerAdapter('rethinkdb', rethinkdbAdapter, { default: true });

  return DS;

}