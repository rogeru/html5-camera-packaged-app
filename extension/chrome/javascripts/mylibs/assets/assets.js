(function() {

  define(['mylibs/utils/utils'], function(utils) {
    'use strict';
    var assets, pub;
    assets = [
      {
        name: "glasses",
        src: "chrome/images/glasses.png",
        address: "/effects/props"
      }, {
        name: "horns",
        src: "chrome/images/horns.png",
        address: "/effects/props"
      }, {
        name: "hipster",
        src: "chrome/images/hipster.png",
        address: "/effects/props"
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
                }, asset.address
              ]);
            };
          })(asset));
        }
        return _results;
      }
    };
  });

}).call(this);
