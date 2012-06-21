define([
  
], () ->
	
	Color = (red, green, blue, alpha, cssClass) ->
		r: red
		g: green
		b: blue
		a: alpha
		css: ->
			"rgba(#{this.r},#{this.g},#{this.b},#{this.a})"
		class: -> 
			return cssClass

	[
		new Color 255, 255, 255, 255, "selected"
		new Color 0, 0, 0, 255
		new Color 255, 0, 0, 255
		new Color 255, 192, 0, 255
		new Color 255, 255, 0, 255
		new Color 146, 208, 80, 255
		new Color 0, 176, 80, 255
		new Color 0, 176, 240, 255
		new Color 0, 112, 192, 255
		new Color 0, 32, 96, 255
		new Color 112, 48, 160, 255
		new Color 227, 227, 227, 255
		new Color 196, 196, 196, 255
		new Color 168, 168, 168, 255
		new Color 138, 138, 138, 255
		new Color 110, 110, 110, 255
		new Color 82, 82, 82, 255
		new Color 54, 54, 54, 255
	]


	# red: $.extend({}, color, { r: 255, g: 0, b: 0, a: 255 }) 
	# darkRed: $.extend({}, color, { r: 192, g: 0, b: 0, a: 255 })
	# black: $.extend({}, color, { r: 0, g: 0, b: 0, a: 255 })
	# yellow: 


		# colors: -> 

		# 	$.extend(white, color, { r: 255, g: 255, b: 255, a: 255 })
			

		# 	red:
		# 		r: 255
		# 		g: 0
		# 		b: 0
		# 		a: 255
		# 		css: "rgba(255,0,0,1)"

		# 	black: 
		# 		r: 0
		# 		g: 0
		# 		b: 0
		# 		a: 255
		# 		css: "rgba(0,0,0,1)"
			
)