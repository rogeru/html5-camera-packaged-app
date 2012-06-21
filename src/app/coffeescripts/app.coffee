define([
  'mylibs/camera/camera'
  'mylibs/snapshot/snapshot'
  'mylibs/photobooth/photobooth'
  'mylibs/controls/controls'
  'mylibs/customize/customize'
  'mylibs/share/share'
  'text!intro.html'
  'mylibs/pictures/pictures'
  'mylibs/preview/preview'
  'mylibs/preview/selectPreview'
  'mylibs/utils/utils'
  'mylibs/postman/postman'
  'mylibs/stamp/stamp'
  'mylibs/modal/modal'
  'mylibs/assets/assets'
], (camera, snapshot, photobooth, controls, customize, share, intro, pictures, preview, selectPreview, utils, postman, stamp, modal, assets) ->
	
		pub = 
		    
			init: ->

				# fire up the postman!
				postman.init()

				# start up the asset pipeline
				assets.init()

			    # all UI elements as modules must be created as instances here
			    # in the application main controller file

		        # initalize the utils
				utils.init()

				# initialize the modal window
				modal.init()
				
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

					# initialize the sharing window
					share.init()

					# initialize the pictures pane. we can show that safely without
					# waiting on the rest of the UI or access to video
					pictures.init "pictures"

					# we are done loading the app. have the postman deliver that msg.
					$.publish "/postman/deliver", [ { message: ""}, "/app/ready" ]

					#share.init()
	)
