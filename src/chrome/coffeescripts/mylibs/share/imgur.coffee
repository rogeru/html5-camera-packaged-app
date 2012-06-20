define([
], () ->
	
	'strict mode'

	URL = "http://api.imgur.com/2/upload.json"
	KEY = "c86d236c329f59e6143f010c7356983e"

	pub = 
	
		upload: (dataURL, callback) ->

			img = dataURL.split(',')[1]

			$.ajax 
				
				url: URL
				
				type: "POST"

				data: {
					key: KEY
					image: img
					title: "testing"
					type: "base64"
				}
				
				dataType: "json"
				
				error: ->

					$.publish("/postman/deliver", [{ message: { success: false, message: "imgur failed" } }, "/pictures/share/imgur"] )
				
				success: (data) ->

					link = data.upload.links.imgur_page
					window.open "https://twitter.com/intent/tweet?url=#{link}&hashtags=h5c"
					
					$.publish("/postman/deliver", [{ message: { success: true, message: "" } }, "/pictures/share/imgur" ] )

)