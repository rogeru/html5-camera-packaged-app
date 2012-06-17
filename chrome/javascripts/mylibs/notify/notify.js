(function() {

  define([], function() {
    var pub;
    return pub = {
      init: function() {
        return $.subscribe("/notify/show", function(title, body, sticky) {
          var notification;
          return notification = webkitNotifications.createNotification('icon_16.png', title, body);
        });
      }
    };
  });

}).call(this);
