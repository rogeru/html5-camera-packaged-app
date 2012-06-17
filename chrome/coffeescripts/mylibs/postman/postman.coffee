define([

], (file) ->
	
	recipient = {}

	pub =

		init: (r) ->

			recipient = r

			window.onmessage = (event) ->

				# receive the command to save a file
				$.publish event.data.address, [ event.data.message ]

			# subscribe to the send event
			$.subscribe "/postman/deliver", (message, address, block) ->
			
				message.address = address
				recipient.webkitPostMessage message, "*", block
)