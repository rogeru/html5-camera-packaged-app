(function() {

  define([], function() {
    var pub;
    return pub = {
      init: function(controlsId) {
        var $controls;
        $controls = $("#" + controlsId);
        $controls.on("click", "button", function() {
          return $.publish($(this).data("event"));
        });
        return $controls.on("change", "input", function(e) {
          return $.publish("/polaroid/change", [e]);
        });
      }
    };
  });

}).call(this);
