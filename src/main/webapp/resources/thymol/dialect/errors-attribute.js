var varRefExpr = /[\$\*]\{([^}]*)\}/;

function errorsAttrProcessor(element, attr, thAttr) {
  var updated = false;
  // Always remove the element content placeholder
  try {
    while (element.firstChild != null) {
      element.removeChild(element.firstChild);
      if (element.firstChild == null) {
        break;
      }
    }
    updated = true;
    element.removeAttribute(attr.name);
  }
  catch (err) {
    if (thymol.debug) {
      window.alert("text replace error");
    }
  }
  if( !!thymol.requestContext ) {
    var errors = thymol.requestContext["thErrors"];
    if( !!errors ) {
      var varRef  = attr.nodeValue.trim().match( varRefExpr );
      if( varRef && varRef.length > 0 ) {
        var varRefValue = varRef[ 1 ];
        if( !!varRefValue ) {
          var elementErrors = errors[varRefValue];
          if( !!elementErrors ) {
            newTextNode = element.ownerDocument.createTextNode(elementErrors);
            element.appendChild(newTextNode);
            delete errors[varRefValue]; // This is DRY
          }
        }
      }
    }
  }
  return updated;
}
if( !thymol.isClientSide() ) {
  module.exports = errorsAttrProcessor;
}
