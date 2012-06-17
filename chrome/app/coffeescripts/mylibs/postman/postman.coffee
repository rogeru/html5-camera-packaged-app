define([

], (file) ->

	pub =

		init: () ->

			window.onmessage = (event) ->

				# receive the command to save a file
				$.publish event.data.address, [event.data.message]


			# subscribe to the send event
			$.subscribe "/postman/deliver", (message, address) ->
			
				message.address = address
				window.top.webkitPostMessage message, "*"
)