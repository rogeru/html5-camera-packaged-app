(function() {

  define(['libs/webgl/effects', 'mylibs/utils/utils', 'text!mylibs/preview/views/selectPreview.html'], function(effects, utils, template) {
    var $container, canvas, ctx, draw, frame, height, paused, previews, pub, update, video, webgl, width;
    paused = false;
    canvas = {};
    ctx = {};
    video = {};
    previews = [];
    $container = {};
    webgl = fx.canvas();
    frame = 0;
    width = 200;
    height = 150;
    update = function() {
      var preview, _i, _len, _results;
      if (!paused) {
        ctx.drawImage(window.HTML5CAMERA.canvas, 0, 0, width, height);
        _results = [];
        for (_i = 0, _len = previews.length; _i < _len; _i++) {
          preview = previews[_i];
          frame++;
          if (preview.kind === "face") {
            _results.push(preview.filter(preview.canvas, canvas));
          } else {
            _results.push(preview.filter(preview.canvas, canvas, frame));
          }
        }
        return _results;
      }
    };
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    return pub = {
      draw: function() {
        return draw();
      },
      init: function(container, c, v) {
        var $currentPage, $nextPage, ds;
        effects.init();
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        $.subscribe("/previews/show", function() {
          video.width = canvas.width = width;
          video.height = canvas.height = height;
          return $container.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
              paused = false;
              return effects.isPreview = true;
            }
          });
        });
        previews = [];
        video = v;
        $container = $("#" + container);
        video.width = canvas.width = width;
        video.height = canvas.height = height;
        $currentPage = {};
        $nextPage = {};
        ds = new kendo.data.DataSource({
          data: effects.data,
          pageSize: 6,
          change: function() {
            var item, _i, _len, _ref, _results;
            $currentPage = $container.find(".current-page");
            $nextPage = $container.find(".next-page");
            paused = true;
            previews = [];
            _ref = this.view();
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              item = _ref[_i];
              _results.push((function() {
                var $content, $template, content, preview;
                $template = kendo.template(template);
                preview = {};
                $.extend(preview, item);
                if (item.kind === "face") {
                  preview.canvas = document.createElement("canvas");
                  preview.canvas.width = 200;
                  preview.canvas.height = 150;
                } else {
                  preview.canvas = fx.canvas();
                }
                content = $template({
                  name: preview.name,
                  width: width,
                  height: height
                });
                $content = $(content);
                previews.push(preview);
                $content.find("a").append(preview.canvas).click(function() {
                  paused = true;
                  $("footer").kendoStop(true).kendoAnimate({
                    effects: "fadeOut",
                    hide: true,
                    duration: 200
                  });
                  $container.kendoStop(true).kendoAnimate({
                    effects: "zoomOut fadeOut",
                    hide: true,
                    duration: 500
                  });
                  return $.publish("/preview/show", [preview]);
                });
                $nextPage.append($content);
                $currentPage.kendoStop(true).kendoAnimate({
                  effects: "slide:down fadeOut",
                  duration: 500,
                  hide: true,
                  complete: function() {
                    $currentPage.removeClass("current-page").addClass("next-page");
                    return $currentPage.find(".preview").remove();
                  }
                });
                return $nextPage.kendoStop(true).kendoAnimate({
                  effects: "fadeIn",
                  duration: 500,
                  show: true,
                  complete: function() {
                    $nextPage.removeClass("next-page").addClass("current-page");
                    return paused = false;
                  }
                });
              })());
            }
            return _results;
          }
        });
        $container.on("click", ".more", function() {
          paused = true;
          if (ds.page() < ds.totalPages()) {
            return ds.page(ds.page() + 1);
          } else {
            return ds.page(1);
          }
        });
        return ds.read();
      },
      pause: function() {
        return paused = true;
      },
      resume: function() {
        return paused = false;
      },
      capture: function(callback) {
        return webgl.ToDataURL;
      }
    };
  });

}).call(this);
