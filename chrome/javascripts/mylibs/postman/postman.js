(function() {

  define([], function(file) {
    var pub, recipient;
    recipient = {};
    return pub = {
      init: function(r) {
        recipient = r;
        window.onmessage = function(event) {
          return $.publish(event.data.address, [event.data.message]);
        };
        return $.subscribe("/postman/deliver", function(message, address, block) {
          message.address = address;
          return recipient.webkitPostMessage(message, "*", block);
        });
      }
    };
  });

}).call(this);
