module.exports = function() {

  function getKey(table) {
    var values = table.getAll();
    var maxId = -1;
    for (var _len = values.length, indx = 0; indx < _len; indx++) {
      var pid = values[indx].id;
      if (pid > maxId) {
        maxId = pid;
      }
    }
    return maxId + 1;
  }
  
  return {
    getKey : getKey
  };  
  
}();