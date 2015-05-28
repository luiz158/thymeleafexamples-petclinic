module.exports = function(app,express,dbChoice) {

  var JSData = require('js-data');

  var DS;
  switch( dbChoice ) {
    case "rethink": {
      DS = require(  "./database/rethinkdbDS")(JSData);
      break;
    }
    case "sqlite": {
      DS = require(  "./database/sqlite3DS")(JSData);
      break;
    }
    default:
      DS = require(  "./database/rethinkdbDS")(JSData);
  }

  require( "./database/datastore")(DS);

  require( "./routes/router" )(app,express);

  require( "./setup" );
  
};