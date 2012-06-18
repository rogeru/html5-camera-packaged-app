define([
  'mylibs/file/file'
  'mylibs/share/share'
  'text!mylibs/pictures/views/picture.html'
], (file, share, picture) ->
	
	$container = {}

	create = (message) ->
		
		# get the template
		template = kendo.template(picture)

		# inject the new picture source onto the template
		html = template({ image: message.image })

		# wrap the html in jQuery so we can search it and stuff. easily.
		$div = $(html)

		# get the image element from the template
		$img = $div.find(".picture")

		# assign the picture a unique file name based on the current timestamp
		message.name = message.name || new Date().getTime() + ".png"

		# photostrips cannot be customzized. to tell the difference, prefix the
		# file name with a p_		
		if message.strip
			message.name = "p_" + message.name
		
		# the image can be customized by clicking on it
		else
			# this callback is used to set the img source from the customize window
			callback = ->
				$img.attr "src", arguments[0] 
				$.publish "/postman/deliver", [{ message: { name: message.name, image: arguments[0] } }, "/file/save"]

			# give the image a pointer mouse and attach a click event
			$img.addClass("pointer")
			$img.on("click", -> $.publish("/customize", [ this, callback ]) )

		# save if a save is requested
		if message.save
			$.publish "/postman/deliver", [{ message: { name: message.name, image: message.image } }, "/file/save"]

		# when the image fully loads, we need to rebuild the pinterest sytle
		# layout by calling reload on the masonry plugin
		$img.load ->
			$container.masonry("reload")

		##### these are the actions for the action bar below each image

		# add the source to the download link
		$div.on("click", ".download", ->
        	$.publish "/postman/deliver", [{ message: { name: name, image: $img.attr("src") } }, "/file/download"]
		)	

		$div.on("click", ".intent", ->
    		$.publish "/postman/deliver", [ { message: { image: $img.attr("src") } }, "/intents/share" ]
		)

		$div.on "click", ".trash", ->
			$.subscribe "/file/deleted/#{message.name}", ->
				$div.remove()
				$container.masonry "reload"
				$.unsubscribe "file/deleted/#{message.name}"
			$.publish "/postman/deliver", [ { message: { name: message.name } }, "/file/delete" ]

		##### end action bar events

		# all done. append the template to the container
		$container.append($div)

	pub = 
		
		init: (containerId) ->
			
			# the id of the container comes in from the initializer. grab
			# it from the DOM
			$container = $("##{containerId}")

			# initialize the jquery masonry layout plugin
			$container.masonry()


			# subscribe to events
			$.subscribe "/pictures/reload", ->
				pub.reload()

			$.subscribe "/pictures/create", (message) ->
				create(message)

			$.subscribe "/pictures/bulk", (message) ->

				for file in message
					create(file)
				

		reload: ->

			$container.masonry("reload")
	
)
