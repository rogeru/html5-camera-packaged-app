define([
  
], () ->
	
	$window = $("<div style='text-align: center'><img src='images/loading-image.gif' alt='loading...' /></div>").kendoWindow(
		width: 100
		height: 100
		modal: true
		actions: {}
		draggable: false
		title: false
	).data("kendoWindow").center()

	show: ->	

		$window.open()

	close: ->

		$window.close()
)