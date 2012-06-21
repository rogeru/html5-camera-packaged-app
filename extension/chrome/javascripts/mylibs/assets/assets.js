(function() {

  define(['mylibs/utils/utils'], function(utils) {
    'use strict';
    var assets, pub;
    assets = [
      {
        name: "glasses",
        src: "chrome/images/glasses.png"
      }, {
        name: "horns",
        src: "chrome/images/horns.png"
      }, {
        name: "hipster",
        src: "chrome/images/hipster.png"
      }, {
        name: "google",
        src: "chrome/images/glasses.png"
      }
    ];
    return pub = {
      init: function() {
        var asset, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = assets.length; _i < _len; _i++) {
          asset = assets[_i];
          _results.push((function(asset) {
            var img;
            img = new Image();
            img.src = asset.src;
            return img.onload = function() {
              return $.publish("/postman/deliver", [
                {
                  message: {
                    name: asset.name,
                    image: img.toDataURL()
                  }
                }, "/assets/add"
              ]);
            };
          })(asset));
        }
        return _results;
      }
    };
  });

}).call(this);
