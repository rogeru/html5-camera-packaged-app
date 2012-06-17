(function() {

  define([], function(file) {
    var pub;
    return pub = {
      init: function() {
        window.onmessage = function(event) {
          return $.publish(event.data.address, [event.data.message]);
        };
        return $.subscribe("/postman/deliver", function(message, address) {
          message.address = address;
          return window.top.webkitPostMessage(message, "*");
        });
      }
    };
  });

}).call(this);
