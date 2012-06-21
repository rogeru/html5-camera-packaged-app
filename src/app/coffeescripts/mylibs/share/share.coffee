define([
  'text!mylibs/share/views/share.html'
], (share) ->

	viewModel = kendo.observable
		src: "images/placeholder.png"
		name: null
		actions: "block"
		working: "none"
		tweet: ->
			$.publish "/postman/deliver", [ { message: { image: this.get("src"), link: currentLink } }, "/share/twitter" ]
			$actions.kendoStop(true).kendoAnimate { effects: "slide:down fadeOut", duration: 500, hide: true }
			$working.kendoStop(true).kendoAnimate { effects: "slideIn:down fadeIn", duration: 500, show: true }
		google: ->
			$.publish "/postman/deliver", [ { message: { image: this.get("src"), link: currentLink } }, "/share/google" ]
			$actions.kendoStop(true).kendoAnimate { effects: "slide:down fadeOut", duration: 500, hide: true }
			$working.kendoStop(true).kendoAnimate { effects: "slideIn:down fadeIn", duration: 500, show: true }

	modal = {}
	$actions = {}
	$working = {}
	links = []
	currentLink = null

	pub = 

		init: ->

    		$.subscribe "/share/show", (src, name) ->
	
    			currentLink = null

    			# search through the links list for a matching link
    			for link in links
    				if link.name == name
    					currentLink = link.link

	    		viewModel.set "src", src
	    		viewModel.set "name", name

	    		modal.center().open()

	    	$.subscribe "/share/success", (message) ->
	    		# add the link we just got back for this image to the array of links
	    		links.push name: viewModel.name, link: message.link
	    		currentLink = message.link
	    		
	    		$working.kendoStop(true).kendoAnimate { effects: "slide:up fadeOut", duration: 500, hide: true }
	    		$actions.kendoStop(true).kendoAnimate { effects: "slideIn:up fadeIn", duration: 500, show: true }


    		$content = $(share)
    		$actions = $content.find(".actions")
    		$working = $content.find(".working")

    		modal = $content.kendoWindow 
    			visible: true
    			modal: true 
    			animation: 
    				open: 
    					effects: "slideIn:up fadeIn"
    					duration: 500
    				close:
    					effects: "slide:up fadeOut"
    					duration: 500
    		.data("kendoWindow")

    		kendo.bind $content, viewModel

    	show: ->

    		$content = $(share)

    		modal.content $content

    		modal.show()
            
)
