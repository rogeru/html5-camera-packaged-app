define([
  #'mylibs/utils/utils'
  'mylibs/share/gdrive'
  'mylibs/share/resumableupload'
  'mylibs/share/util'
  'mylibs/share/gdocs'
], (gdrive) ->
	
	createFolder = (title) ->

	upload = (blob) ->
		gdocs.upload blob

	pub = 

		init: ->

			# gdrive.init()

			# subscribe to events
			# $.subscribe "/share/gdrive/upload", (blob) ->
			# 	gdocs.upload(blob)

			gdocs = new GDocs()

			# getDocs = ->

			# 	console.log gdocs.accessToken

			# 	$.ajax 
			# 		url: gdocs.DOCLIST_FEED
			# 		headers: {
			# 			"Authorization": "Bearer #{gdocs.accessToken}"
			# 			"GData-Version": "3.0"
			# 		},
			# 		type: "GET"
			# 		data: {"alt": "json"}
					
			# 		success: (data) ->

			# 			console.log(data)

			# 		error: ->

			gdocs.auth ->

			 	$.ajax 
			 		url: "https://www.googleapis.com/drive/v1/files"
			 		type: "POST"
			 		headers: {
						"Authorization": "Bearer #{gdocs.accessToken}"
			 		},
			 		contentType: 'application/json'
			 		processData: false
			 		data: JSON.stringify { "title": "Silver Rings", "mimeType": "application/vnd.google-app.folder" }



)