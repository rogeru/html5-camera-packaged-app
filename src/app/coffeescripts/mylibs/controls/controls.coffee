define([
], () ->
	
	pub = 
		
		init: ( controlsId ) ->
			
			$controls = $("##{controlsId}")
		
			# listen for the button click events
			$controls.on("click", "button", ->
				$.publish($(this).data("event"))
			)
			
			$controls.on("change", "input", (e) -> 
                # listen for the polaroid check change
                $.publish( "/polaroid/change", [e] )
			)
			
)
