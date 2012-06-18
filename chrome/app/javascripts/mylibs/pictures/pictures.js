(function() {

  define(['mylibs/file/file', 'mylibs/share/share', 'text!mylibs/pictures/views/picture.html'], function(file, share, picture) {
    var $container, create, pub;
    $container = {};
    create = function(message) {
      var $div, $img, callback, html, template;
      template = kendo.template(picture);
      html = template({
        image: message.image
      });
      $div = $(html);
      $img = $div.find(".picture");
      message.name = message.name || new Date().getTime() + ".png";
      if (message.strip) {
        message.name = "p_" + message.name;
      } else {
        callback = function() {
          $img.attr("src", arguments[0]);
          return $.publish("/postman/deliver", [
            {
              message: {
                name: message.name,
                image: arguments[0]
              }
            }, "/file/save"
          ]);
        };
        $img.addClass("pointer");
        $img.on("click", function() {
          return $.publish("/customize", [this, callback]);
        });
      }
      if (message.save) {
        $.publish("/postman/deliver", [
          {
            message: {
              name: message.name,
              image: message.image
            }
          }, "/file/save"
        ]);
      }
      $img.load(function() {
        return $container.masonry("reload");
      });
      $div.on("click", ".download", function() {
        return $.publish("/postman/deliver", [
          {
            message: {
              name: name,
              image: $img.attr("src")
            }
          }, "/file/download"
        ]);
      });
      $div.on("click", ".intent", function() {
        return $.publish("/postman/deliver", [
          {
            message: {
              image: $img.attr("src")
            }
          }, "/intents/share"
        ]);
      });
      $div.on("click", ".trash", function() {
        $.subscribe("/file/deleted/" + message.name, function() {
          $div.remove();
          $container.masonry("reload");
          return $.unsubscribe("file/deleted/" + message.name);
        });
        return $.publish("/postman/deliver", [
          {
            message: {
              name: message.name
            }
          }, "/file/delete"
        ]);
      });
      return $container.append($div);
    };
    return pub = {
      init: function(containerId) {
        $container = $("#" + containerId);
        $container.masonry();
        $.subscribe("/pictures/reload", function() {
          return pub.reload();
        });
        $.subscribe("/pictures/create", function(message) {
          return create(message);
        });
        return $.subscribe("/pictures/bulk", function(message) {
          var file, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = message.length; _i < _len; _i++) {
            file = message[_i];
            _results.push(create(file));
          }
          return _results;
        });
      },
      reload: function() {
        return $container.masonry("reload");
      }
    };
  });

}).call(this);
