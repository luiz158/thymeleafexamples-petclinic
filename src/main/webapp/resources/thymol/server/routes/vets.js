module.exports = function(express) {

  var  xml2js = require( 'xml2js' );
  var Feed = require( 'feed' );

  var vets = express.Router();

  vets.get( '/', function( req, res ) {
    var Vets = thymol.database.vets;
    if( !!Vets ) {
      var allVets = {};
      allVets.vetList = Vets.getAll();
      if( allVets.vetList !== null ) {
        if( "/vets.xml" === req.baseUrl ) {
          res.type('xml');
          res.send( toXml( allVets.vetList ) );
        }
        else if( "/vets.atom" === req.baseUrl ) {
          res.set( 'Content-Type', 'application/rss+xml' );
          res.send( toAtom( allVets.vetList, req.get( "Referer" ) ) );
        }
        else {
          if( !thymol.requestContext ) {
            thymol.requestContext = thymol.makeContext("request", undefined);
          }
          thymol.requestContext.createVariable( "vets", allVets );
          res.locals.requestContext = thymol.requestContext;
          res.redirect( "/vets/vetList.html" );
        }
      }
    }
  } );

  function toXml( vetsList ) { // Massage the data a little and marshal as xml
    var vets = {};
    var vls = [];
    for( var i = 0, iLimit = vetsList.length; i < iLimit; i++ ) {
      var vet = vetsList[i];
      var v = {
        id: vet.id,
        firstName: vet.firstName,
        lastName: vet.lastName
      };
      var sps = [];
      for( var j = 0, jLimit = vet.specialties.length; j < jLimit; j++ ) {
        var s = {
          id: vet.specialties[j].specialty_id,
          name: vet.specialties[j].specialty.name
        }
        sps.push(s);
      }
      v.specialties = sps;
      vls.push(v);
    }
    vets.vetList = vls;
    var builder = new xml2js.Builder( {rootName: "vets" } );
    var xml = builder.buildObject(vets);
    return xml;
  }

  function toAtom( vetsList, baseUrl ) { // Massage the data a little and marshal as atom
    var feed = new Feed({
      title: "Veterinarians",
      id: "tag:springsource.org",
      link: baseUrl
    });
    for( var i = 0, iLimit = vetsList.length; i < iLimit; i++ ) {
      var vet = vetsList[i];
      var fullName = vet.firstName + " " + vet.lastName;
      var sps = [];
      for( var j = 0, jLimit = vet.specialties.length; j < jLimit; j++ ) {
        sps.push(vet.specialties[j].specialty.name);
      }
      var item = {
        title: fullName,
        id: vet.id,
        description: sps,
        link: baseUrl + "?vet_id=" + vet.id,
        date: new Date()
      };
      feed.addItem( item );
    }
    var atom = feed.render('atom-1.0');
    return atom;
  }

  return vets;

};