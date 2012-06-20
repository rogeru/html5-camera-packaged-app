(function() {

  define(['mylibs/share/gdrive', 'mylibs/share/imgur', 'mylibs/share/resumableupload', 'mylibs/share/util', 'mylibs/share/gdocs'], function(gdrive, imgur) {
    var createFolder, pub, upload;
    createFolder = function(title) {};
    upload = function(blob) {
      return gdocs.upload(blob);
    };
    return pub = {
      init: function() {
        var gdocs;
        $.subscribe("/share/imgur", function(message) {
          return imgur.upload(message.image);
        });
        gdocs = new GDocs();
        return gdocs.auth(function() {
          return $.ajax({
            url: "https://www.googleapis.com/drive/v1/files",
            type: "POST",
            headers: {
              "Authorization": "Bearer " + gdocs.accessToken
            },
            contentType: 'application/json',
            processData: false,
            data: JSON.stringify({
              "title": "Silver Rings",
              "mimeType": "application/vnd.google-app.folder"
            })
          });
        });
      }
    };
  });

}).call(this);
