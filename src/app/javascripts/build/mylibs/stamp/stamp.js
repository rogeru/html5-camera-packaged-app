(function() {

  define(['mylibs/stamp/colors', 'text!mylibs/stamp/views/stamp.html', 'libs/webgl/glfx'], function(pallet, stamp) {
    
    var $window, bufferTexture, canvas, createBlobBrush, createBuffers, drawSafe, pixelsBetweenStamps, pub, render, requestAnimationFrame, setupMouse, stampTexture, stampX, stampY, texture, updateBrush, viewModel;
    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    $window = {};
    canvas = {};
    drawSafe = {};
    stampX = 0;
    stampY = 0;
    texture = {};
    bufferTexture = {};
    stampTexture = {};
    pixelsBetweenStamps = 0;
    viewModel = kendo.observable({
      activeBrush: null,
      colors: pallet,
      draw: function(e) {
        var $item, color, rgba;
        $item = $(e.target);
        rgba = $item.data("colors");
        color = colors[rgba];
        updateBrush();
        this.set("activeBrush", e.targetElement);
        return $(e.targetElement).css("border", "1px solid #fff");
      },
      save: function() {}
    });
    render = function() {
      var thisTexture;
      thisTexture = canvas.texture(drawSafe);
      canvas.draw(thisTexture);
      canvas.matrixWarp([-1, 0, 0, 1], false, true);
      canvas.blend(bufferTexture, 1);
      canvas.update();
      return requestAnimationFrame(render);
    };
    createBuffers = function(length) {
      var _results;
      _results = [];
      while (buffer.length < length) {
        _results.push(buffer.push(canvas.texture(drawSafe)));
      }
      return _results;
    };
    updateBrush = function() {
      stampTexture = canvas.texture(createBlobBrush({
        r: 255,
        g: 27,
        b: 145,
        a: 255,
        radius: 5,
        fuzziness: 1
      }));
      return pixelsBetweenStamps = 5 / 4;
    };
    createBlobBrush = function(options) {
      var brush, c, data, dx, dy, factor, h, i, length, w, x, y;
      brush = document.createElement("canvas");
      w = brush.width = options.radius * 2;
      h = brush.height = options.radius * 2;
      c = brush.getContext("2d");
      data = c.createImageData(w, h);
      x = 0;
      while (x < w) {
        y = 0;
        while (y < h) {
          i = (x + y * w) * 4;
          dx = (x - options.radius + 0.5) / options.radius;
          dy = (y - options.radius + 0.5) / options.radius;
          length = Math.sqrt(dx * dx + dy * dy);
          factor = Math.max(0, Math.min(1, (1 - length) / (options.fuzziness + 0.00001)));
          data.data[i + 0] = options.r;
          data.data[i + 1] = options.g;
          data.data[i + 2] = options.b;
          data.data[i + 3] = Math.max(0, Math.min(255, Math.round(options.a * factor)));
          y++;
        }
        x++;
      }
      c.putImageData(data, 0, 0);
      return brush;
    };
    setupMouse = function() {
      var isDragging;
      isDragging = false;
      stampX = 0;
      stampY = 0;
      canvas.addEventListener('mousedown', function(e) {
        var x, y;
        x = e.offsetX;
        y = e.offsetY;
        canvas.swapContentsWith(bufferTexture);
        canvas.stamp([[x, y, 1, 1, 0, 1]], stampTexture);
        canvas.swapContentsWith(bufferTexture);
        isDragging = true;
        stampX = x;
        stampY = y;
        return e.preventDefault();
      }, false);
      canvas.addEventListener("mousemove", (function(e) {
        var dx, dy, length, stamps, x, y;
        if (!isDragging) return;
        x = e.offsetX;
        y = e.offsetY;
        stamps = [];
        while (true) {
          dx = x - stampX;
          dy = y - stampY;
          length = Math.sqrt(dx * dx + dy * dy);
          if (length < pixelsBetweenStamps) break;
          stampX += dx * pixelsBetweenStamps / length;
          stampY += dy * pixelsBetweenStamps / length;
          stamps.push([stampX, stampY, 1, 1, 0, 1]);
        }
        if (stamps.length > 0) {
          canvas.swapContentsWith(bufferTexture);
          canvas.stamp(stamps, stampTexture);
          return canvas.swapContentsWith(bufferTexture);
        }
      }), false);
      return document.addEventListener("mouseup", (function(e) {
        return isDragging = false;
      }), false);
    };
    return pub = {
      init: function() {
        var $content;
        $content = $(stamp);
        drawSafe = document.createElement("canvas");
        canvas = fx.canvas();
        $content.find(".canvas").append(canvas);
        $window = $content.kendoWindow({
          visible: false,
          modal: true,
          title: "",
          open: function() {
            return $.publish("/app/pause");
          },
          close: function() {
            return $.publish("/app/resume");
          },
          animation: {
            open: {
              effects: "slideIn:up fadeIn",
              duration: 500
            },
            close: {
              effects: "slide:up fadeOut",
              duration: 500
            }
          }
        }).data("kendoWindow").center();
        kendo.bind($content, viewModel);
        return $.subscribe("/stamp/show", function(src) {
          var ctx, oldImage;
          oldImage = new Image();
          oldImage.src = src;
          drawSafe.width = oldImage.width;
          drawSafe.height = oldImage.height;
          ctx = drawSafe.getContext("2d");
          ctx.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height);
          texture = canvas.texture(drawSafe);
          bufferTexture = canvas.texture(texture.width(), texture.height());
          bufferTexture.clear();
          updateBrush();
          setupMouse();
          render();
          return $window.open();
        });
      }
    };
  });

}).call(this);
