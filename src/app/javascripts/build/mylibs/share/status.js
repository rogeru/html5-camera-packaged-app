(function() {

  define([], function() {
    var $window;
    $window = $("<div><img src='images/loading-image.gif' alt='loading...' /></div>").kendoWindow({
      modal: true,
      actions: {},
      draggable: false,
      title: false
    }).data("kendoWindow").center();
    return {
      show: function() {
        return $window.open();
      },
      close: function() {
        return $window.close();
      }
    };
  });

}).call(this);
