define([
  'mylibs/share/gdocs'
], () ->
	
	pub = 

		init: ->

			# subscribe to events
			#$.subscribe "/gdrive/sync", ->

				gdocs = new GDocs()

				getDocs = ->

					$.ajax 
						url: gdocs.DOCLIST_FEED
						headers: [
							"Authorization": "Bearer #{gdocs.accessToken}"
							"GData-Version": "3.0"
						],
						data: {"alt": "json"}
						success: ->

							console.log "success"

						error: ->

							console.log "error"

				gdocs.auth ->
    				getDocs()


)