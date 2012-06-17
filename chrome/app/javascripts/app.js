(function() {

  define(['libs/jquery/jquery', 'libs/kendo/kendo', 'mylibs/camera/camera', 'mylibs/snapshot/snapshot', 'mylibs/photobooth/photobooth', 'mylibs/controls/controls', 'mylibs/customize/customize', 'mylibs/file/file', 'mylibs/share/share', 'text!intro.html', 'mylibs/pictures/pictures', 'mylibs/preview/preview', 'mylibs/preview/selectPreview', 'mylibs/share/share', 'mylibs/utils/utils', 'mylibs/postman/postman'], function($, kendo, camera, snapshot, photobooth, controls, customize, file, share, intro, pictures, preview, selectPreview, share, utils, postman) {
    var pub;
    return pub = {
      init: function() {
        postman.init();
        utils.init();
        $.subscribe('/camera/unsupported', function() {
          return $('#pictures').append(intro);
        });
        return camera.init("countdown", function() {
          preview.init("camera", camera.video);
          selectPreview.init("previews", camera.canvas, camera.video);
          selectPreview.draw();
          snapshot.init(preview, "pictures");
          photobooth.init(460, 340);
          controls.init("controls");
          customize.init("customize");
          pictures.init("pictures");
          file.init(5000);
          return $.publish("/postman/deliver", [
            {
              message: ""
            }, "/app/ready"
          ]);
        });
      }
    };
  });

}).call(this);
