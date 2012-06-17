define([
  'libs/jquery/jquery',	# lib/jquery/jquery
  'libs/kendo/kendo', 	# lib/underscore/underscore
  'mylibs/camera/normalize'
  'mylibs/preview/selectPreview'
  'mylibs/preview/preview'
], ($, kendo, normalize, selectPreview, preview) ->

    $counter = {}
    utils = {}
    canvas = {}
    ctx = {}

    paused = false

    setup = (callback) ->

        videoDiv = document.createElement('div')
        document.body.appendChild(videoDiv)

        videoDiv.appendChild(pub.video)

        videoDiv.setAttribute("style", "display:none;")
        
        # start the video
        pub.video.play()
        
        pub.video.width = 200   
        pub.video.height = 150
        
        # the camera is all started and ready
        if callback then callback()


    turnOn = (callback, testing) ->
	      
        if window.HTML5CAMERA.IS_EXTENSION
          
            window.HTML5CAMERA.canvas = canvas
            
            $.subscribe "/camera/update", (message) ->

                imgData = ctx.getImageData 0, 0, canvas.width, canvas.height
                videoData = new Uint8ClampedArray(message.image)
                imgData.data.set(videoData)

                ctx.putImageData(imgData, 0, 0)

            callback()

        else

	     
    	    hollaback = (stream) ->

                # create a video element and assign the WebRTC stream as its source
                e = window.URL || window.webkitURL

                pub.video.src = if e then e.createObjectURL(stream) else stream

                # we have the stream
                $(pub.video).attr("src", if (window.URL and window.URL.createObjectURL) then window.URL.createObjectURL(stream) else stream)
                $(pub.video).attr("prop", if (window.URL and window.URL.createObjectURL) then window.URL.createObjectURL(stream) else stream)


                setup(callback)

        	errback = ->

        		# webRTC is supported, but we did trying to get the stream
        		console.log("Your thing is not a thing.")
            
    	    
    	    if navigator.getUserMedia

                navigator.getUserMedia(normalize(

                    video: true
                    audio: false
                
                ), hollaback, errback)
                
    	    else

         	    $.publish("/camera/unsupported")

    countdown = ( num, hollaback ) ->
        
        # get the counters element 
        counters = $counter.find("span")
        index = counters.length - num
        
        # countdown to 1 before taking the image. fadeout numbers along the way.
        $(counters[index]).css("opacity", "1").animate( { opacity: .1 }, 1000, -> 
            if num > 1
                num--
                countdown( num, hollaback )
            else
                hollaback()
        )

    pub =
    	
    	init: (counter, callback) ->

            # set a reference to the countdown DOM object
            $counter = $("##{counter}")

            pub.video = document.createElement("video")
            #pub.video.src = "burke.mp4"

            canvas = document.createElement("canvas")
            canvas.width = 460
            canvas.height = 340

            ctx = canvas.getContext("2d")
    		
    		# turn on the camera
            turnOn(callback, true)
            
            $.subscribe("/camera/countdown", ( num, hollaback ) ->
                countdown(num, hollaback)
            )

    			
    	video: {}
)
