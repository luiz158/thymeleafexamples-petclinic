
module.exports = function(app,express) {

  var owners = require('./owners')(express);
  app.use( '/owners', owners );
  app.use( '/owners.html', owners );
  
  var vets = require('./vets')(express);
  app.use( '/vets.html', vets );
  app.use( '/vets.xml', vets );
  app.use( '/vets.atom', vets );

  var pets = require('./pets')(express);
  app.use( '/pets', pets );
    
  var mappedServletRequest = require('./mappedServletRequest')(express);
  app.use( '/thServletRequest', mappedServletRequest );
  
};