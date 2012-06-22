define([
  'mylibs/pictures/pictures'
], (effects, filters, snapshot, utils, file) ->
	
	polaroid = false
	preview = {}
	$container = {}
	svg = []
	
	create = (src) ->
		
		animation = effects: "slideIn:down fadeIn", show: true, duration: 1000

		$.publish "/pictures/create", [ { image: src , name: null, photoStrip: false, save: true } ]
	
	develop = (opacity) ->
		
		if opacity < 1
			opacity = opacity + .01
			$image.css("opacity", opacity)
		else 
			$.unsubscribe("/shake/beta")
			$.unsubscribe("/shake/gamma")
	
		return opacity
		
	pub =
		
		init: ( sender, container ) ->
			
			preview = sender
			
			$container = $("##{container}")
			
			# listen for the polaroid selection
			$.subscribe("/polaroid/change", (e) ->  
	            if (e.currentTarget.checked) 
                    polaroid = true
                else
                    polaroid = false
			)
			
			$.subscribe("/snapshot/create", (src) ->
			    create src
			)
	
	
)
