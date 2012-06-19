define([
	
], () ->


	pub =

		init: ->

			$.subscribe "/notify/show", (title, body, sticky) ->					

				close = ->
					notification.close()

				notification = webkitNotifications.createNotification '16.png', title, body

				if not sticky
					setTimeout close, 3000

				notification.show()

)
