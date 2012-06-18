(function() {

  define([], function() {
    var pub;
    return pub = {
      init: function() {
        return $.subscribe("/notify/show", function(title, body, sticky) {
          var close, notification;
          close = function() {
            return notification.close();
          };
          notification = webkitNotifications.createNotification('16.png', title, body);
          if (!sticky) setTimeout(close, 3000);
          return notification.show();
        });
      }
    };
  });

}).call(this);
