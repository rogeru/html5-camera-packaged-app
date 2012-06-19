define([
  'libs/jquery/jquery' 	# lib/jquery/jquery
  'libs/kendo/kendo' 	# lib/underscore/underscore
  'mylibs/camera/camera'
  'mylibs/snapshot/snapshot'
  'mylibs/photobooth/photobooth'
  'mylibs/controls/controls'
  'mylibs/customize/customize'
  'mylibs/file/file'
  'mylibs/share/share'
  'text!intro.html'
  'mylibs/pictures/pictures'
  'mylibs/preview/preview'
  'mylibs/preview/selectPreview'
  'mylibs/share/share'
  'mylibs/utils/utils'
  'mylibs/postman/postman'
  'mylibs/stamp/stamp'
], ($, kendo, camera, snapshot, photobooth, controls, customize, file, share, intro, pictures, preview, selectPreview, share, utils, postman, stamp) ->
	
		pub = 
		    
			init: ->

				# fire up the postman!
				postman.init()

			    # all UI elements as modules must be created as instances here
			    # in the application main controller file

		        # initalize the utils
				utils.init()
				
				$.subscribe('/camera/unsupported', ->
				    $('#pictures').append(intro)
				)
				
				# initialize the camera
				camera.init "countdown", ->

					preview.init("camera", camera.video)

					# initialize the preview selection
					selectPreview.init("previews", camera.canvas, camera.video)

					# draw the video to the previews with webgl textures
					selectPreview.draw()

					# initialize snapshots 
					snapshot.init(preview, "pictures")

					# initialize photobooth
					photobooth.init 460, 340

					# initialize the buttons
					controls.init("controls")

					# initialilize the customize window
					customize.init()

					# initialize the stamping window
					stamp.init()

					# initialize the pictures pane. we can show that safely without
					# waiting on the rest of the UI or access to video
					pictures.init "pictures"

					# initialize the file system. this will read in any files that
					# we have saved, or grant initial access for storage
					file.init 5000

					# we are done loading the app. have the postman deliver that msg.
					$.publish "/postman/deliver", [ { message: ""}, "/app/ready" ]

					#share.init()
	)
