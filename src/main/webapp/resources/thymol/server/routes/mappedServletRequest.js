module.exports = function(express) {

  var Url = require('url');

  var validator = require('./../utils/validator');
  var dbHelper = require('./../utils/dbHelper');

  var mappedServletRequest = express.Router();

  mappedServletRequest.get( '/*', function( req, res ) {
    handleServletRequest( req, res, req.query );
  } );

  mappedServletRequest.post( '/*', function( req, res ) {
    handleServletRequest( req, res, req.body );
  } );

  function handleServletRequest( req, res, submitted ) {
    var referer = req.get( "Referer" );
    var pUrl = Url.parse(referer);
    var splits = pUrl.path.split("/");
    switch( splits[1]) {
      case "pets":
        if( "edit.html" === splits[3] || "createOrUpdateVisitForm.html" === splits[2] ) {
          handleCreateOrUpdateVisit(req, res, submitted);
        }
        break;
      case "owners":
        if( "edit.html" === splits[3] ) {
          handleCreateOrUpdateOwner(req, res, submitted, splits[2] );
        }
        else if( "createOrUpdateOwnerForm.html" === splits[2] ) {
          handleCreateOrUpdateOwner(req, res, submitted);
        }
        break;
      case "vets":
        res.end();
        break;
      case "thServletRequest":
        res.redirect();
        break;
      default:
        res.redirect("back");
        break;
    }
  }
  
  function handleCreateOrUpdateVisit( req, res, submitted ) {
    var dov = submitted.date.replace( /\//g, "-" );
    var petId = parseInt( submitted.petId );
    var newVisit = thymol.database.visits.createInstance({
      id: dbHelper.getKey( thymol.database.visits ),
      pet_id: petId,
      visit_date: dov,
      description: submitted.description
    });
    delete newVisit.date;
    delete newVisit.dov;
    newVisit.DSCreate().then( function(visit) {
      var pet = thymol.database.pets.get( petId );
      pet.birthDate = new PCDate( pet.birth_date );
      if( !thymol.requestContext ) {
        thymol.requestContext = thymol.makeContext("request", undefined);
      }
      thymol.requestContext.createVariable( "owner", pet.owner );
      res.locals.requestContext = thymol.requestContext;
      res.redirect( "/owners/ownerDetails.html" );
    } );
  }  
  
  function handleCreateOrUpdateOwner( req, res, submission, owner_id ) {
    var create = false;
    var newOwner = {};
    if(!!owner_id) {
      var owner = thymol.database.owners.get(owner_id);
      for( var k in owner ) {
        if( owner.hasOwnProperty( k ) ) {
          newOwner[k] = owner[ k ];
        }
      }
    }
    else {
      create = true;
   }
    var result = {};
    result.errors = {};
    result.updated = false;
    validator.doValidate( result, newOwner, submission, "firstName", true, validator.genericNameExpr, "Invalid value (should be alphabetic or punctuation characters)!" );
    validator.doValidate( result, newOwner, submission, "lastName", true, validator.genericNameExpr, "Invalid value (should be alphabetic or punctuation characters)!" );
    validator.doValidate( result, newOwner, submission, "address", true, validator.addressNameExpr, "Invalid value (should be alpha-numeric or punctuation characters)!" );
    validator.doValidate( result, newOwner, submission, "city", true, validator.genericNameExpr, "Invalid value (should be alphabetic or punctuation characters)!" );
    validator.doValidate( result, newOwner, submission, "telephone", false, validator.telephoneNumberExpr, "numeric value out of bounds (<10 digits>.<0 digits> expected)" );
    var haveErrors = Object.keys( result.errors ).length !== 0;
    if( !thymol.requestContext ) {
      thymol.requestContext = thymol.makeContext("request", undefined);
    }
    res.locals.requestContext = thymol.requestContext;
    if( haveErrors ) {
      thymol.requestContext.createVariable( "owner", newOwner );
      thymol.requestContext.createVariable( "thErrors", result.errors );
      res.redirect( "/owners/createOrUpdateOwnerForm.html" );  // Do a redirect instead of a render here to prevent a referrer loop!
    }
    else {
      if( create ) {
        var owner = thymol.database.owners.createInstance({
          id: dbHelper.getKey( thymol.database.owners ),
          first_name: newOwner.firstName,
          last_name: newOwner.lastName,
          address: newOwner.address,
          city: newOwner.city,
          telephone: newOwner.telephone
        });
        delete owner.firstName;
        delete owner.lastName;
        owner.DSCreate().then(function (thiz) {
          thymol.requestContext.createVariable( "owner", thiz );
          res.redirect( "/owners/ownerDetails.html" );
        });
      }
      else if( result.updated ) {
        var owner = thymol.database.owners.get(owner_id);
        for( var k in newOwner ) {
          if( newOwner.hasOwnProperty( k ) &&  owner.hasOwnProperty( k ) ) {
            if( newOwner[k] !== owner[ k ] ) {
              owner[ k ] = newOwner[k];
            }
          }
        }
        owner.firstName = undefined;
        owner.lastName = undefined;
        owner.new = undefined;
        owner.DSSave().then(function (thiz) {
          thiz.firstName = thiz.first_name;
          thiz.lastName = thiz.last_name;
          thymol.requestContext.createVariable( "owner", thiz );
          res.redirect( "/owners/ownerDetails.html" );
        });
      }
      else {
        thymol.requestContext.createVariable( "owner", newOwner );
        res.redirect( "/owners/ownerDetails.html" );
      }
    }
  }

  return mappedServletRequest;

};