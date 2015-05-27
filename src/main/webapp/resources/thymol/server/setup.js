var localPath = "";
var  pathToScripts = "../../../../resources/thymol/dialect/";
global.thIndexFile = "welcome";
global.thMessagePath = "../../../../../resources/messages";
global.thMessagesBaseName = "messages";
global.thExtendedMapping = true;

global.PCDate = function(dv) {
  this.dateValue = new Date(dv);
  this.toDate = function() {
    return this.dateValue;
  }
  this.toString = function() {
    return this.dateValue.toString();
  }
}
PCDate.prototype.constructor = PCDate;

var addPetclinicDialect = function() {
    fieldsObject = require( "../dialect/fields-object.js" );
    fieldAttrProcessor = require( "../dialect/field-attribute.js" );
    errorsAttrProcessor = require( "../dialect/errors-attribute.js" );
    methodAttrProcessor = require( "../dialect/method-attribute.js" );
  thymol.addDialect({
    prefix : 'th',
    attributeProcessors : [
      { name : 'method',
        processor : methodAttrProcessor,
        precedence : 950,  // Higher than 1000
        override: true },  // Replace standard processor
      { name : 'field',
        processor : fieldAttrProcessor,
        precedence : 1200 },
      { name : 'errors',
        processor : errorsAttrProcessor,
        precedence : 1250 }
    ],
    objects : [
      fieldsObject
    ]
  });
  thymol.conversionService = function(arg) {
    if( arg instanceof PCDate ) {
      return thymol.objects.thDatesObject.format(arg.toDate(),'dd/MMM/yyyy');
    }
    return arg;
  };
  thymol.ready(function () {
    thymol.configurePreExecution(function () {
      var pathMap = {servletPath: "/thServletRequest/"};
      thymol.thExpressionObjects["#httpServletRequest"] = pathMap;
    });
  });
}();

global.thMappings = [
   ["/webjars/jquery/1.11.1/jquery.js",                                   "http://code.jquery.com/jquery-2.1.3.min.js"],
   ["/webjars/bootstrap/2.3.0/css/bootstrap.min.css",                     "http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap.min.css"],
   ["/webjars/jquery-ui/1.9.2/js/jquery-ui-1.9.2.custom.js",              "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"],
   ["/webjars/jquery-ui/1.9.2/css/smoothness/jquery-ui-1.9.2.custom.css", "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/smoothness/jquery-ui.css"]
 ];

