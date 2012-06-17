define([

  'mylibs/utils/utils'

], (utils) ->

  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem

  fileSystem = {}
  myPicturesDir = {}
  blobBuiler = {}

  compare = (a,b) ->
    
    if a.name < b.name
      return -1
  
    if a.name > b.name
      return 1
  
    return 0

  errorHandler = (e) ->

    msg = ''

    switch e.code
      when FileError.QUOTA_EXCEEDED_ERR
        msg = 'QUOTA_EXCEEDED_ERR'
      when FileError.NOT_FOUND_ERR
        msg = 'NOT_FOUND_ERR'
      when FileError.SECURITY_ERR
        msg = 'SECURITY_ERR'
      when FileError.INVALID_MODIFICATION_ERR
        msg = 'INVALID_MODIFICATION_ERR'
      when FileError.INVALID_STATE_ERR
        msg = 'INVALID_STATE_ERR'
      else
        msg = 'Unknown Error'

    console.log('Error: ' + msg);


    $.publish("/msg/error", ["Access to the file system could not be obtained."])    

  save = (name, dataURL) ->

        console.log "Saving file #{name}"

        # convert the incoming image into a blob for storage
        blob = utils.toBlob(dataURL)

        fileSystem.root.getFile name,  create: true, (fileEntry) ->

          fileEntry.createWriter (fileWriter) ->

            fileWriter.onwriteend = (e) ->

              $.publish "/notify/show", [ "File Saved!", "The picture was saved succesfully", false ]

            fileWriter.onerror = (e) ->

                console.error "Write failed: " + e.toString()

            fileWriter.write blob
                
        , errorHandler

  destroy = (name) ->

      fileSystem.root.getFile name, create: false, (fileEntry) ->

        fileEntry.remove ->

            $.publish "/postman/deliver", [ { message: "" }, "/file/deleted/#{name}" ]

        , errorHandler

      , errorHandler


  read = ->

    window.webkitStorageInfo.requestQuota PERSISTENT, 5000 * 1024, (grantedBytes) ->
        
        window.requestFileSystem PERSISTENT, grantedBytes, success, errorHandler

    success = (fs) ->

      console.log("Got File Access!")

      fs.root.getDirectory "MyPictures", create: true, (dirEntry) ->

        myPicturesDir = dirEntry

        entries = []
        files = []
        
        dirReader = fs.root.createReader()
        animation = effects: "zoomIn fadeIn", show: true, duration: 1000

        read = ->

          dirReader.readEntries (results) ->

            # get a count of how many files we are expecting by adding them to an array
            # if they are of type 'file'
            for entry in results  
              if entry.isFile
                entries.push(entry)

            readFile = (i) ->

              entry = entries[i]

              if entry.isFile

                name = entry.name

                entry.file (file) ->

                    reader = new FileReader()

                    reader.onloadend = (e) ->

                      # if this is a photostrip, we need to deliver it as such.
                      if name.substring(0, 1) == "p"
                        strip = true

                      # we are going to add this to an array of files to be sent over.  They need to display in the same order everytime
                      # in order to do that we need to collect them here by checking the length of the array we are building against the length
                      # of the array that is holding the file entries.  Once they are the same, we know we have them all and we can sort by name
                      # which is the timestamp, and send them down to the app.
                      files.push({ name: name, image: this.result, strip: strip })

                      if files.length == entries.length
                        
                        # sort the files array by name
                        files.sort(compare)

                        # send it down to the app
                        $.publish "/postman/deliver", [ { message: files }, "/pictures/bulk", [] ]

                      else
                        readFile(++i)

                    reader.readAsDataURL(file)

            if entries.length > 0
              readFile(0)

        read()

      , errorHandler

      fileSystem = fs

  pub = 

    init: (kb) ->

      # subscribe to events
      $.subscribe "/file/save", (message) ->
        save message.name, message.image

      $.subscribe "/file/delete", (message) ->
        destroy message.name

      $.subscribe "/file/read", (message) ->
        read()

      

)