(function() {

  define([], function() {
    var $window;
    $window = $("<div style='text-align: center'><img src='images/loading-image.gif' alt='loading...' /></div>").kendoWindow({
      width: 100,
      height: 100,
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
