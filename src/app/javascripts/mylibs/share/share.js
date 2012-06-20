(function() {

  define(['mylibs/share/status'], function(status) {
    var pub;
    return pub = {
      showStatus: function() {
        return status.show();
      },
      closeStatus: function() {
        return status.close();
      }
    };
  });

}).call(this);
