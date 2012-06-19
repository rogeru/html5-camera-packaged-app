(function() {

  define(['mylibs/utils/utils', 'libs/webgl/effects', 'libs/webgl/glfx.min'], function(utils, effects) {
    var $container, canvas, ctx, currentCanvas, draw, frame, height, paused, preview, pub, update, video, webgl, width;
    $container = {};
    canvas = {};
    ctx = {};
    webgl = {};
    video = {};
    paused = true;
    preview = {};
    width = 460;
    height = 340;
    frame = 0;
    currentCanvas = {};
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    update = function() {
      if (!paused) {
        ctx.drawImage(window.HTML5CAMERA.canvas, 0, 0, width, height);
        frame++;
        if (preview.kind === "face") {
          return preview.filter(canvas, window.HTML5CAMERA.canvas);
        } else {
          return preview.filter(webgl, canvas, frame);
        }
      }
    };
    return pub = {
      init: function(container, v) {
        var $footer, $header, $mask, $preview;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        $container = $("#" + container);
        $header = $container.find(".header");
        $preview = $container.find(".body");
        $mask = $container.find(".mask");
        $footer = $container.find(".footer");
        webgl = fx.canvas();
        $preview.append(canvas);
        $preview.append(webgl);
        $.subscribe("/preview/show", function(e) {
          effects.isPreview = false;
          effects.clearBuffer();
          $.extend(preview, e);
          if (preview.kind === "face") {
            $(webgl).hide();
            $(canvas).show();
            currentCanvas = canvas;
          } else {
            $(webgl).show();
            $(canvas).hide();
            currentCanvas = webgl;
          }
          paused = false;
          video.width = canvas.width = width;
          video.height = canvas.height = height;
          $header.kendoStop(true).kendoAnimate({
            effects: "fadeIn",
            show: true,
            duration: 500
          });
          $preview.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500
          });
          return $footer.kendoStop(true).kendoAnimate({
            effects: "slideIn:up fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              return $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
            }
          });
        });
        $container.find("#effects").click(function() {
          paused = true;
          $("footer").kendoStop(true).kendoAnimate({
            effects: "fadeOut",
            hide: true,
            duration: 200
          });
          $header.kendoStop(true).kendoAnimate({
            effects: "fadeOut",
            hide: true,
            duration: 500
          });
          $preview.kendoStop(true).kendoAnimate({
            effects: "zoomOut fadeOut",
            hide: true,
            duration: 500
          });
          $footer.kendoStop(true).kendoAnimate({
            effects: "slide:down fadeOut",
            hide: true,
            duration: 500
          });
          return $.publish("/previews/show");
        });
        $.subscribe("/preview/snapshot", function() {
          var callback;
          $.publish("/controls/disable");
          callback = function() {
            return $mask.fadeIn(50, function() {
              $mask.fadeOut(900);
              $.publish("/snapshot/create", [currentCanvas.toDataURL()]);
              return $.publish("/controls/enable");
            });
          };
          return $.publish("/camera/countdown", [3, callback]);
        });
        $.subscribe("/preview/photobooth", function() {
          var callback, images, photoNumber;
          images = [];
          photoNumber = 2;
          callback = function() {
            --photoNumber;
            return $mask.fadeIn(50, function() {
              return $mask.fadeOut(900, function() {
                images.push(currentCanvas.toDataURL());
                if (photoNumber > 0) {
                  return $.publish("/camera/countdown", [3, callback]);
                } else {
                  return $.publish("/photobooth/create", [images]);
                }
              });
            });
          };
          return $.publish("/camera/countdown", [3, callback]);
        });
        return draw();
      }
    };
  });

}).call(this);
