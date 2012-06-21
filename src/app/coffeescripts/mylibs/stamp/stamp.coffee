define([
  'mylibs/stamp/colors'
  'text!mylibs/stamp/views/stamp.html'
  'libs/webgl/glfx'
], (pallet, stamp) ->
	
	'use strict'

	requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame

	$window = {}
	$activeBrush = null
	canvas = {}
	drawSafe = {}
	stampX = 0
	stampY = 0
	texture = {}
	bufferTexture = {}
	stampTexture = {}
	pixelsBetweenStamps = 0
	callback = {}

	viewModel = kendo.observable {

		draw: (e) ->

			if $activeBrush
				$activeBrush.removeClass("selected")

			$activeBrush = $(e.target).addClass("selected")
			
			r = $activeBrush.data "r"
			g = $activeBrush.data "g"
			b = $activeBrush.data "b"
			a = $activeBrush.data "a"

			updateBrush(r, g, b, a)

		yep: ->

			callback canvas.toDataURL()
			$window.close()

		nope: ->

			$window.close()

	}

	render = ->
		thisTexture = canvas.texture(drawSafe)
		#texture.loadContentsOf drawSafe
		canvas.draw thisTexture
		canvas.matrixWarp [ -1, 0, 0, 1 ], false, true
		canvas.blend bufferTexture, 1
		canvas.update()
		requestAnimationFrame render

	createBuffers = (length) ->
 		buffer.push canvas.texture(drawSafe)  while buffer.length < length

	updateBrush = (red, green, blue, alpha) ->
		# get = (name) ->
		# 	parseFloat document.getElementById("options." + name).value
		stampTexture = canvas.texture(createBlobBrush(
			r: red 
			g: green
			b: blue 
			a: alpha
			radius: 5
			fuzziness: 1
		))
		pixelsBetweenStamps = 5 / 4

	updateStamp = (image) ->

		stampTexture = canvas.texture(createBlobStamp(image))

	createBlobStamp = (image) ->
		stamp = document.createElement("canvas")
		w = stamp.width = image.width
		h = stamp.height = image.height
		c = stamp.getContext("2d")
		stamp.drawImage image, 0, 0, image.width, image.height

		stamp

	createBlobBrush = (options) ->
		brush = document.createElement("canvas")
		w = brush.width = options.radius * 2
		h = brush.height = options.radius * 2
		c = brush.getContext("2d")
		data = c.createImageData(w, h)
		x = 0

		while x < w
			y = 0

			while y < h
				i = (x + y * w) * 4
				dx = (x - options.radius + 0.5) / options.radius
				dy = (y - options.radius + 0.5) / options.radius
				length = Math.sqrt(dx * dx + dy * dy)
				factor = Math.max(0, Math.min(1, (1 - length) / (options.fuzziness + 0.00001)))
				data.data[i + 0] = options.r
				data.data[i + 1] = options.g
				data.data[i + 2] = options.b
				data.data[i + 3] = Math.max(0, Math.min(255, Math.round(options.a * factor)))
				y++
			x++
		c.putImageData data, 0, 0

		brush	

	setupMouse = ->

		isDragging = false
		stampX = 0
		stampY = 0

		# setup mouse events on this canvas
		canvas.addEventListener 'mousedown', (e) ->
			x = e.offsetX
			y = e.offsetY
			canvas.swapContentsWith(bufferTexture)
			canvas.stamp([[ x, y, 1, 1, 0, 1 ]], stampTexture)
			canvas.swapContentsWith(bufferTexture)
			isDragging = true
			stampX = x
			stampY = y
			e.preventDefault()
		, false

		# attach a mouse move event to the document
		canvas.addEventListener "mousemove", ((e) ->
			return  unless isDragging
			x = e.offsetX
			y = e.offsetY
			stamps = []
			loop
				dx = x - stampX
				dy = y - stampY
				length = Math.sqrt(dx * dx + dy * dy)
				break  if length < pixelsBetweenStamps
				stampX += dx * pixelsBetweenStamps / length
				stampY += dy * pixelsBetweenStamps / length
				stamps.push [ stampX, stampY, 1, 1, 0, 1 ]
			if stamps.length > 0
				canvas.swapContentsWith bufferTexture
				canvas.stamp stamps, stampTexture
				canvas.swapContentsWith bufferTexture
			), false

		document.addEventListener "mouseup", ((e) ->
				isDragging = false
		), false

	pub = 

		init: ->

			template = kendo.template(stamp)

			$content = $(template(pallet))

			# create a canvas for drawing to
			drawSafe = document.createElement("canvas")

			# setup the mouse on the canvas
			canvas = fx.canvas()

			# append the canvas to the HTML
			$content.find(".canvas").append(canvas)

			# setup the modal window
			$window = $content.kendoWindow
				visible: false
				modal: true
				title: ""
				open: ->
					$.publish("/app/pause")
				close: ->
					$.publish("/app/resume")
				animation: 
					open:
						effects: "slideIn:up fadeIn"
						duration: 500
					close:
						effects: "slide:up fadeOut"
						duration: 500
			.data("kendoWindow").center()

			# bind the view model
			kendo.bind($content, viewModel)

			# listen to events
			$.subscribe "/stamp/show", (src, saveFunction) ->

				callback = saveFunction

				oldImage = new Image()
				oldImage.src = src

				drawSafe.width = oldImage.width
				drawSafe.height = oldImage.height

				ctx = drawSafe.getContext("2d")

				ctx.drawImage(oldImage, 0, 0, oldImage.width, oldImage.height)

				texture = canvas.texture(drawSafe)

				bufferTexture = canvas.texture(texture.width(), texture.height())
				bufferTexture.clear()
			
				updateBrush(0,0,0,255)

				setupMouse()
				render()

				$window.open()
		

)