if( thymol.isClientSide() ) {
  thymol.ThUtils.loadScript( thymol.location + "client/setup.js");
}
else {
  module.exports = function(app,express) {
    var dbChoice = "sqlite"; // Choice of "rethink" or "sqlite"
    require( "./server/webapp" )(app,express,dbChoice);
  };    
}