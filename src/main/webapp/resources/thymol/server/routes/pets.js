module.exports = function(express) {

  var pets = express.Router();

  pets.post( '/createOrUpdatePetForm.html', function( req, res ) {
    if( !!req.body ) {
      if( "put" === req.body._method ) {
        return handlePut( req, res );
      }
    }
    res.redirect( "/owners/ownerDetails.html" );
  } );

  pets.put( '/createOrUpdatePetForm.html', function( req, res ) {
    handlePut( req, res );
  } );

  function handlePut( req, res ) {
    res.redirect( "/owners/ownerDetails.html" );
  };

  return pets;

};