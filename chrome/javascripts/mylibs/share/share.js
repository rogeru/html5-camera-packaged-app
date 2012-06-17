(function() {

  define(['mylibs/share/gdocs'], function() {
    var pub;
    return pub = {
      init: function() {
        var gdocs, getDocs;
        gdocs = new GDocs();
        getDocs = function() {
          return $.ajax({
            url: gdocs.DOCLIST_FEED,
            headers: [
              {
                "Authorization": "Bearer " + gdocs.accessToken,
                "GData-Version": "3.0"
              }
            ],
            data: {
              "alt": "json"
            },
            success: function() {
              return console.log("success");
            },
            error: function() {
              return console.log("error");
            }
          });
        };
        return gdocs.auth(function() {
          return getDocs();
        });
      }
    };
  });

}).call(this);
