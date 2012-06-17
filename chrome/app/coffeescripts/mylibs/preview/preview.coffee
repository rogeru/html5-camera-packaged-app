define([
  'mylibs/utils/utils'
  'libs/webgl/effects'
  'libs/webgl/glfx.min'
], (utils, effects) ->
    
    $container = {}
    canvas = {}
    ctx = {}
    webgl = {}
    video = {}
    paused = true
    preview = {}
    width = 460
    height = 340
    frame = 0
    currentCanvas = {}
    
    draw = ->
        utils.getAnimationFrame()(draw)
        update()
        
    update = ->

        if not paused
            
            ctx.drawImage(window.HTML5CAMERA.canvas, 0, 0, width, height)
            element = canvas
            
            frame++

            if preview.kind == "face"

                preview.filter(canvas, canvas)

            else

                preview.filter(webgl, canvas, frame)

    pub =
        
        init: (container, v) ->
            
            canvas = document.createElement("canvas")
            ctx = canvas.getContext("2d")

            $container = $("##{container}")
            
            $header = $container.find(".header")
            $preview = $container.find(".body")
            $mask = $container.find(".mask")
            $footer = $container.find(".footer")

            webgl = fx.canvas()

            # $preview.append(webgl)
            $preview.append(canvas)
            $preview.append(webgl)
            
            $.subscribe("/preview/show", (e) ->
                
                effects.isPreview = false

                effects.clearBuffer()

                $.extend(preview, e)

                if preview.kind == "face"
                    $(webgl).hide()
                    $(canvas).show()
                    currentCanvas = canvas
                else
                    $(webgl).show()
                    $(canvas).hide()
                    currentCanvas = webgl

                #$.preview.find("canvas").remove()
                #$.preview.append(canvas)

                paused = false
                
                video.width = canvas.width =  width
                video.height = canvas.height = height
                
                $header.kendoStop(true).kendoAnimate({ effects: "fadeIn", show: true, duration: 500 })
                $preview.kendoStop(true).kendoAnimate({ effects: "zoomIn fadeIn", show: true, duration: 500})
                $footer.kendoStop(true).kendoAnimate({ effects: "slideIn:up fadeIn", show: true, duration: 500, complete: ->
                    $("footer").kendoStop(true).kendoAnimate({ effects: "fadeIn", show: true, duration: 200 })
                })
            )
            
            $container.find("#effects").click(->
                
                paused = true

                $("footer").kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 200 })
                $header.kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 500 })
                $preview.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500 })
                $footer.kendoStop(true).kendoAnimate({ effects: "slide:down fadeOut", hide: true, duration: 500 })
                
                $.publish("/previews/show")
                
            )
            
            # listen for the snapshot event
            $.subscribe "/preview/snapshot", ->
                
                callback = ->
                    
                    $mask.fadeIn 50, -> 
                        $mask.fadeOut 900
                        $.publish("/snapshot/create", [currentCanvas.toDataURL()])
                    
                $.publish("/camera/countdown", [3, callback])

            $.subscribe "/preview/photobooth", ->

                images = []
                photoNumber = 2

                callback = ->

                    --photoNumber

                    $mask.fadeIn 50, -> 
                        $mask.fadeOut 900, ->

                            images.push currentCanvas.toDataURL()

                            if photoNumber > 0

                                $.publish "/camera/countdown", [3, callback]

                            else

                                $.publish("/photobooth/create", [images])

                $.publish "/camera/countdown", [3, callback]
                        
            draw()
    
)
