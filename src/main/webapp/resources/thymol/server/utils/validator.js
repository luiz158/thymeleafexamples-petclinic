module.exports = function() {

  var dateExpr = /^\d{4}-\d{1,2}-\d{1,2}$/;
  var genericNameExpr = /^[a-zA-Z '\-]+$/;
  var addressNameExpr = /^[a-zA-Z0-9 '.,\-]+$/;
  var telephoneNumberExpr = /^\d{1,10}$/;
  var petTypeExpr = /[a-z]{3,}/;
  
  var doValidate = function( result, pojo, submission, name, required, expr, errorMessage, absentMessage ) {
    var field = submission[name];
    var previous = pojo[name];
    pojo[name] = field;           // Make the change whether valid or not
    if( field !== previous ) {
      result.updated = true;
    }
    if (!!field && field.length > 0) {
      if( field !== previous ) {
        if (!expr.test(field)) {
          result.errors[name] = errorMessage;
        }
      }
    }
    else {
      if( !!required ) {
        if( !!absentMessage ) {
          result.errors[name] = absentMessage;
        }
        else {
          result.errors[name] = "may not be empty";
        }
      }
    }
    return result;
  };
  
  return {
    doValidate : doValidate,
    dateExpr : dateExpr,
    genericNameExpr : genericNameExpr,
    addressNameExpr : addressNameExpr,
    telephoneNumberExpr : telephoneNumberExpr,
    petTypeExpr : petTypeExpr
  };  
  
}();