define([
  'mylibs/share/status'
], (status) ->
        
    pub = 
    
        showStatus: ->

            status.show()

        closeStatus: ->

            status.close()
            
)
