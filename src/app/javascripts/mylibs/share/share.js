(function() {

  define(['mylibs/share/status', 'text!mylibs/share/views/share.html'], function(status, share) {
    var $actions, $working, currentLink, links, modal, pub, viewModel;
    viewModel = kendo.observable({
      src: null,
      name: null,
      actions: "block",
      working: "none",
      tweet: function() {
        $.publish("/postman/deliver", [
          {
            message: {
              image: this.get("src"),
              link: currentLink
            }
          }, "/share/twitter"
        ]);
        $actions.kendoStop(true).kendoAnimate({
          effects: "slide:down fadeOut",
          duration: 500,
          hide: true
        });
        return $working.kendoStop(true).kendoAnimate({
          effects: "slideIn:down fadeIn",
          duration: 500,
          show: true
        });
      },
      google: function() {
        $.publish("/postman/deliver", [
          {
            message: {
              image: this.get("src"),
              link: currentLink
            }
          }, "/share/google"
        ]);
        $actions.kendoStop(true).kendoAnimate({
          effects: "slide:down fadeOut",
          duration: 500,
          hide: true
        });
        return $working.kendoStop(true).kendoAnimate({
          effects: "slideIn:down fadeIn",
          duration: 500,
          show: true
        });
      }
    });
    modal = {};
    $actions = {};
    $working = {};
    links = [];
    currentLink = null;
    return pub = {
      init: function() {
        var $content;
        $.subscribe("/share/show", function(src, name) {
          var link, _i, _len;
          currentLink = null;
          for (_i = 0, _len = links.length; _i < _len; _i++) {
            link = links[_i];
            if (link.name === name) currentLink = link.link;
          }
          viewModel.set("src", src);
          viewModel.set("name", name);
          return modal.center().open();
        });
        $.subscribe("/share/success", function(message) {
          links.push({
            name: viewModel.name,
            link: message.link
          });
          currentLink = message.link;
          $working.kendoStop(true).kendoAnimate({
            effects: "slide:up fadeOut",
            duration: 500,
            hide: true
          });
          return $actions.kendoStop(true).kendoAnimate({
            effects: "slideIn:up fadeIn",
            duration: 500,
            show: true
          });
        });
        $content = $(share);
        $actions = $content.find(".actions");
        $working = $content.find(".working");
        modal = $content.kendoWindow({
          visible: true,
          modal: true,
          animation: {
            open: {
              effects: "slideIn:up fadeIn",
              duration: 500
            },
            close: {
              effects: "slide:up fadeOut",
              duration: 500
            }
          }
        }).data("kendoWindow");
        return kendo.bind($content, viewModel);
      },
      show: function() {
        var $content;
        $content = $(share);
        modal.content($content);
        return modal.show()({
          showStatus: function() {
            return status.show();
          },
          closeStatus: function() {
            return status.close();
          }
        });
      }
    };
  });

}).call(this);
