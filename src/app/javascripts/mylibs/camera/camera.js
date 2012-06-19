(function() {

  define(['libs/jquery/jquery', 'libs/kendo/kendo', 'mylibs/camera/normalize', 'mylibs/preview/selectPreview', 'mylibs/preview/preview'], function($, kendo, normalize, selectPreview, preview) {
    var $counter, canvas, countdown, ctx, paused, pub, setup, turnOn, utils;
    $counter = {};
    utils = {};
    canvas = {};
    ctx = {};
    paused = false;
    setup = function(callback) {
      var videoDiv;
      videoDiv = document.createElement('div');
      document.body.appendChild(videoDiv);
      videoDiv.appendChild(pub.video);
      videoDiv.setAttribute("style", "display:none;");
      pub.video.play();
      pub.video.width = 200;
      pub.video.height = 150;
      if (callback) return callback();
    };
    turnOn = function(callback, testing) {
      var errback, hollaback;
      if (window.HTML5CAMERA.IS_EXTENSION) {
        window.HTML5CAMERA.canvas = canvas;
        $.subscribe("/camera/update", function(message) {
          var imgData, videoData;
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          videoData = new Uint8ClampedArray(message.image);
          imgData.data.set(videoData);
          return ctx.putImageData(imgData, 0, 0);
        });
        return callback();
      } else {
        hollaback = function(stream) {
          var e;
          e = window.URL || window.webkitURL;
          pub.video.src = e ? e.createObjectURL(stream) : stream;
          $(pub.video).attr("src", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
          $(pub.video).attr("prop", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
          return setup(callback);
        };
        errback = function() {
          return console.log("Your thing is not a thing.");
        };
        if (navigator.getUserMedia) {
          return navigator.getUserMedia(normalize({
            video: true,
            audio: false
          }), hollaback, errback);
        } else {
          return $.publish("/camera/unsupported");
        }
      }
    };
    countdown = function(num, hollaback) {
      var counters, index;
      counters = $counter.find("span");
      index = counters.length - num;
      return $(counters[index]).css("opacity", "1").animate({
        opacity: .1
      }, 1000, function() {
        if (num > 1) {
          num--;
          return countdown(num, hollaback);
        } else {
          return hollaback();
        }
      });
    };
    return pub = {
      init: function(counter, callback) {
        $counter = $("#" + counter);
        pub.video = document.createElement("video");
        canvas = document.createElement("canvas");
        canvas.width = 460;
        canvas.height = 340;
        ctx = canvas.getContext("2d");
        turnOn(callback, true);
        return $.subscribe("/camera/countdown", function(num, hollaback) {
          return countdown(num, hollaback);
        });
      },
      video: {}
    };
  });

}).call(this);
