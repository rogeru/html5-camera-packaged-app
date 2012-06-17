define([
	
], () ->
	
	pub =

		init: ->

			$.subscribe "/notify/show", (title, body, sticky) ->
				notification = webkitNotifications.createNotification 'icon_16.png', title, body
)