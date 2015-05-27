module.exports = function(express) {

  var validator = require('../utils/validator');
  var dbHelper = require('../utils/dbHelper');

  var owners = express.Router();

  owners.get( '/', function( req, res ) {
    if( !!req.query ) {
      var Owners = thymol.database.owners;
      if( !!Owners ) {
        var lastName = req.query.lastName;
        if( lastName !== null ) {
          var ownersList = null;
          if( lastName !== "" ) { // select owners by last name
            ownersList = Owners.filter( {
              where: {
                lastName: {
                  'contains': lastName
                }
              }
            })
          }
          else { // return all
            ownersList = Owners.getAll();
          }
          if( ownersList !== null ) {
            if( !thymol.requestContext ) {
              thymol.requestContext = thymol.makeContext("request", undefined);
            }
            thymol.requestContext.createVariable( "selections", [ ownersList ] );
            res.locals.requestContext = thymol.requestContext;
          }
          res.redirect( "/owners/ownersList.html" );
        }
      }
    }
  } );

  owners.get( '/find', function( req, res ) {
    findOwners( req, res );
  } );
  owners.get( '/find.html', function( req, res ) {
    findOwners( req, res );
  } );

  owners.get( '/new', function( req, res ) {
    var newOwner = {  // create place-holder object
      new: true
    };
    if( !thymol.requestContext ) {
      thymol.requestContext = thymol.makeContext("request", undefined);
    }
    thymol.requestContext.createVariable( "owner", newOwner );
    res.locals.requestContext = thymol.requestContext;
    res.redirect( "/owners/createOrUpdateOwnerForm.html" );
  } );

  owners.get( '/[0-9]+', function( req, res ) {
    var Owners = thymol.database.owners;
    if( !!Owners ) {
      var url = req.url;
      if( !!url && url.length > 1 ) {
        var indx = parseInt( url.substr(1) );
        if( indx >= 0 ) {
          var owner = Owners.get(indx);
          if( !!owner ) {
            if( !!owner.pets ) {
              for (var _len = owner.pets.length, pIndx = 0; pIndx < _len; pIndx++) {  // Need to reset the birthDate values in case of an abandoned edit
                owner.pets[pIndx].birthDate = new PCDate( owner.pets[pIndx].birth_date );
              }
            }
            if( !thymol.requestContext ) {
              thymol.requestContext = thymol.makeContext("request", undefined);
            }
            thymol.requestContext.createVariable( "owner", owner );
            res.locals.requestContext = thymol.requestContext;
          }
        }
      }
    }
    res.redirect( "/owners/ownerDetails.html" );
  } );

  owners.get( '/[0-9]+/edit.html', function( req, res ) {
    var splits = req.url.split("/");
    var iOwner = splits[1];
    var owner = thymol.database.owners.get(iOwner);
    if( !thymol.requestContext ) {
      thymol.requestContext = thymol.makeContext("request", undefined);
    }
    owner.new = false;
    thymol.requestContext.createVariable( "owner", owner );
    res.locals.requestContext = thymol.requestContext;
    res.render("./owners/createOrUpdateOwnerForm.html", function(err, html) {
      res.send(html);
    });
  } );

  owners.get( '/[0-9]+/pets/[0-9]+/edit', function( req, res ) {
    handlePetEdit( req, res, req.query );
  } );

  owners.post( '/[0-9]+/pets/[0-9]+/edit', function( req, res ) {
    handlePetEdit( req, res, req.body );
  } );

  owners.put( '/[0-9]+/pets/[0-9]+/edit', function( req, res ) {
    handlePetEdit( req, res, req.body );
  } );

  owners.get( '/[0-9]+/pets/new.html', function( req, res ) {
    handlePetEditSubmission( req, res, req.query );
  } );

  owners.post( '/[0-9]+/pets/new.html', function( req, res ) {
    handlePetEditSubmission( req, res, req.body );
  } );

  function handlePetEditSubmission( req, res, submission ) {
    if( !!submission ) {
      submission.new = true;
    }
    handlePetEdit( req, res, submission );
  }

  function handlePetEdit( req, res, submission ) {
    var splits = req.url.split("/");
    var owner_id = parseInt( splits[1] );
    var owner = thymol.database.owners.get(owner_id);
    var newPet = {};
    var create = !!submission.new;
    if( !create ) {
      var pet_id = parseInt( splits[3] );
      if( !!pet_id ) {
        var pet = thymol.database.pets.get(pet_id);
        for( var k in pet ) {
          if( pet.hasOwnProperty( k ) ) {
            newPet[k] = pet[ k ];
          }
        }
//        newPet.birthDate = newPet.birth_date;
      }
      else {
        create = true;
      }
    }
    if( create ) {
      newPet  = {  // create place-holder object
        owner: owner,
        owner_id: owner_id
      };
    }
    if( !thymol.requestContext ) {
      thymol.requestContext = thymol.makeContext("request", undefined);
    }
    thymol.requestContext.createVariable( "types", thymol.database.allTypes );
    res.locals.requestContext = thymol.requestContext;
    if (!!submission && Object.keys(submission).length > 1) {
      var result = {
        errors: {},
        updated: false
      };
      validator.doValidate( result, newPet, submission, "name", true, validator.genericNameExpr, "Invalid value (should be alphabetic or punctuation characters)!" );
      submission.birthDate = submission.birthDate.replace(/\//g, "-");
      validator.doValidate( result, newPet, submission, "birthDate", true, validator.dateExpr, "Invalid value (should be YYYY/MM/DD or YYYY-MM-DD)!" );
      if( create || !!submission.type ) {
        validator.doValidate(result, newPet, submission, "type", create, validator.petTypeExpr, "Invalid value (should be 3 or more alphabetic characters)!", "Select one!");
      }
      if( !!submission.type && !result.errors['type'] ) {
        var newPetType = null;
        for (var _len = thymol.database.allTypes.length, indx = 0; indx < _len; indx++) {
          if (submission.type === thymol.database.allTypes[indx].name) {
            newPetType = thymol.database.allTypes[indx];
            break;
          }
        }
        if (!newPetType) {
          errors.type = "Invalid value (unrecognised pet type)!";
        }
        else {
          if ( newPet.type_id != newPetType.id) {
            newPet.type_id = newPetType.id;
            newPet.type = newPetType;
            if(!create) {
              result.updated = true;
            }
          }
        }
      }
      if( Object.keys( result.errors ).length !== 0 ) {
        thymol.requestContext.createVariable( "pet", newPet );
        thymol.requestContext.createVariable( "thErrors", result.errors );
        res.redirect( "/pets/createOrUpdatePetForm.html" );
      }
      else {
        if( create ) {
          var pet = thymol.database.pets.createInstance({
            id: dbHelper.getKey( thymol.database.pets ),
            name: newPet.name,
            birth_date: newPet.birthDate,
            type_id: newPet.type_id,
            owner_id: newPet.owner_id
          });
          delete pet.birthDate;
          pet.DSCreate().then(function (thiz) {
            thiz.type = newPet.type;
            thiz.owner = owner;
            thymol.requestContext.createVariable("owner", owner);
            res.redirect("/owners/ownerDetails.html");
          });
        }
        else if( result.updated ) {
          var pet = thymol.database.pets.get(pet_id);
          pet.name = newPet.name;
          pet.birth_date = newPet.birthDate;
          pet.type_id = newPet.type_id;
//          delete pet.owner;
          delete pet.birthDate;
          if( !!pet.owner ) {
            delete pet.owner;
          }
//          delete pet.type;
//          delete pet.visits;
          pet.DSSave().then(function (thiz) {
//            owner.pets.push(thiz);
            thiz.birthDate = new PCDate( newPet.birthDate );
            thiz.type = newPet.type;
            thiz.owner = owner;
            thymol.requestContext.createVariable( "owner", owner );
            res.redirect( "/owners/ownerDetails.html" );
          });
        }
        else {
          pet.birthDate = new PCDate( pet.birth_date );
          res.redirect( "/owners/ownerDetails.html" );
        }
      }
      return;
    }
    newPet.owner = owner;
    newPet.birthDate = newPet.birth_date;
    newPet.new = create;
    thymol.requestContext.createVariable( "pet", newPet );
    res.render("./pets/createOrUpdatePetForm.html", function(err, html) {
      res.send(html);
    });
  }

  owners.get( '/[0-9]+/pets/[0-9]+/visits/new', function( req, res ) {
    var splits = req.url.split("/");
    var iOwner = splits[1];
    var owner = thymol.database.owners.get(iOwner);
    var iPet = splits[3];
    var pet = thymol.database.pets.get(iPet);
    pet.birthDate = pet.birth_date;
    pet.owner = owner;
    var newVisit = {  // create place-holder object
      pet_id: iPet,
      dov: new Date(),
      new: true,
      pet: pet
    };
    if( !thymol.requestContext ) {
      thymol.requestContext = thymol.makeContext("request", undefined);
    }
    thymol.requestContext.createVariable( "visit", newVisit );

    res.locals.requestContext = thymol.requestContext;
    res.redirect( "/pets/createOrUpdateVisitForm.html" );
  } );

  var findOwners = function( req, res ) {
    res.redirect( "/owners/findOwners.html" );
  };

  return owners;

};
