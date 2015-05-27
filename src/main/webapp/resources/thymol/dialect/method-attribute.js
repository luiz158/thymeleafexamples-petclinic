/*
  This is a Thymol extension to emulate the behaviour of the Spring dialect th:method attribute,
  adding a surrogate hidden input type for http form methods that aren't usually supported by
  browsers.
 */

function methodAttrProcessor(element, attr, thAttr) {
	var expr = attr.nodeValue, child, domUpdated = false;	
	if( element.nodeName.toLowerCase() === "form") {
	  expr = thymol.getExpression(expr, element);
    if( !!expr ) {
      expr = expr.toLowerCase();
      if( "put" === expr || "delete" === expr ) {
        var child = element.ownerDocument.createElement("input");
        child.setAttribute("type", "hidden");
        child.setAttribute("value", expr);
        child.setAttribute("name", "_method");
        element.appendChild(child);
        element.setAttribute( thAttr.suffix, "post" );
        domUpdated = true;
      }
    }
	}
	element.removeAttribute(attr.name);
	return domUpdated;
}
if( !thymol.isClientSide() ) {
  module.exports = methodAttrProcessor;
}