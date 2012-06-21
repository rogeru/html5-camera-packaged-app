(function() {

  define(['mylibs/camera/camera', 'mylibs/snapshot/snapshot', 'mylibs/photobooth/photobooth', 'mylibs/controls/controls', 'mylibs/customize/customize', 'mylibs/share/share', 'text!intro.html', 'mylibs/pictures/pictures', 'mylibs/preview/preview', 'mylibs/preview/selectPreview', 'mylibs/utils/utils', 'mylibs/postman/postman', 'mylibs/stamp/stamp', 'mylibs/modal/modal'], function(camera, snapshot, photobooth, controls, customize, share, intro, pictures, preview, selectPreview, utils, postman, stamp, modal) {
    var pub;
    return pub = {
      init: function() {
        postman.init();
        utils.init();
        modal.init();
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
          customize.init();
          stamp.init();
          share.init();
          pictures.init("pictures");
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
