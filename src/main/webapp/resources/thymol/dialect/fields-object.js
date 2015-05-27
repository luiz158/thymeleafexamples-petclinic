/*

  This is a Thymol extension to emulate the behaviour of the #fields object when no errors are present.
  Implements only enough functionality to get the STSM examples to do something!

*/
var varRefExpr = /[\$\*]\{([^}]*)\}/;

var fieldsObject = function() {

	var thExpressionObjectName = "#fields";

	function hasErrors(target) {
		var e = errors(target);
		return e.length > 0;
	}

	function errors(target) {
		var errors = [];
		var varRefValue = target.trim();
		if( !!varRefValue ) {
			if( !!thymol.requestContext ) {
				var allErrors = thymol.requestContext["thErrors"];
				if (!!allErrors) {
					var targetError = allErrors[varRefValue];
					if (!!targetError) {
						if( Object.prototype.toString.call( targetError ) === '[object Array]'  ) {
							errors.concat( targetError );
						}
						else {
							errors.push(targetError);
						}
					}
				}
			}
		}
		return errors;
	}

	
	return {
		thExpressionObjectName : thExpressionObjectName,
		hasErrors : hasErrors,
		errors : errors
	};

}();
if( !thymol.isClientSide() ) {
  module.exports = fieldsObject;
}