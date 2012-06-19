/*
Copyright 2012 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Eric Bidelman (ericbidelman@chromium.org)
*/

"use strict";


function GDocs(selector) {

  var SCOPE_ = 'https://docs.google.com/feeds/';
  var DRIVE_ = 'https://www.googleapis.com/drive/v1/files';
  //var RESUMABLE_LINK_SCHEME_ = 'http://schemas.google.com/g/2005#resumable-create-media';
  /*var DEFAULT_MIMETYPES = {
    'atom': 'application/atom+xml',
    'document': 'text/plain',
    'spreadsheet': 'text/csv',
    'presentation': 'text/plain',
    'pdf': 'application/pdf'
  };*/

  //this.renderTarget = document.querySelector(selector);
  this.lastResponse = null;

  this.__defineGetter__('SCOPE', function() {
    return SCOPE_;
  });

  this.__defineGetter__('DOCLIST_FEED', function() {
    return SCOPE_ + 'default/private/full/';
  });

  this.__defineGetter__('DRIVE_API', function() {
    return DRIVE_;
  })

  this.__defineGetter__('CREATE_SESSION_URI', function() {
    return 'https://docs.google.com/feeds/upload/create-session/default/private/full?convert=false&alt=json';//&uploadType=resumable';
  });

  this.__defineGetter__('DEFAULT_CHUNK_SIZE', function() {
    return 1024 * 1024 * 5; // 5MB;
  });
};

GDocs.prototype.auth = function(opt_callback) {
  var self = this;
  try {
    chrome.experimental.identity.getAuthToken(function(token) {
      //log(token);
      //document.querySelector('#authorize-button').disabled = true;
      self.accessToken = token;
      opt_callback && opt_callback();
    });
  } catch(e) {
    log(e);
  }
};

/*
 * Generic HTTP AJAX request handler.
 */
GDocs.prototype.makeRequest = function(method, url, callback, opt_data, opt_headers) {
  var data = opt_data || null;
  var headers = opt_headers || {};

  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  // Include common headers (auth and version) and add rest. 
  xhr.setRequestHeader('Authorization', 'Bearer ' + this.accessToken);
  xhr.setRequestHeader('GData-Version', '3.0');
  for (var key in headers) {
    xhr.setRequestHeader(key, headers[key]);
  }

  var self = this;
  xhr.onload = function(e) {
    self.lastResponse = this.response;
    callback(self.lastResponse, this);
  };
  xhr.onerror = function(e) {
    console.log(this, this.status, this.response,
                this.getAllResponseHeaders());
  };
  xhr.send(data);
};

/**
 * Returns the correct atom link corresponding to the 'rel' value passed in.
 * @param {Array<Object>} links A list of atom link objects.
 * @param {string} rel The rel value of the link to return. For example: 'next'.
 * @return {string|null} The appropriate link for the 'rel' passed in, or null
 *     if one is not found.
 */
GDocs.prototype.getLink = function(links, rel) {
  for (var i = 0, link; link = links[i]; ++i) {
    if (link.rel === rel) {
      return link;
    }
  }
  return null;
};

// /**
//  * Fetches the user's document list.
//  * @param {string?} opt_url A url to query the doclist API with. If omitted,
//  *     the main doclist feed uri is used.
//  */
// GDocs.prototype.getDocumentList = function(opt_url) {
//   this.renderTarget.innerHTML = ''; // Clear current listening.
// 
//   var url = opt_url || this.DOCLIST_FEED + '?' + Util.stringify({'alt': 'json'});
//   this.makeRequest('GET', url, this.render.bind(this));
// };

/**
 * Fetches the user's document list.
 * @param {string?} opt_url A url to query the doclist API with. If omitted,
 *     the main doclist feed uri is used.
 */
GDocs.prototype.getDocumentList = function(opt_url, opt_callback) {
  //this.renderTarget.innerHTML = ''; // Clear current listening.

  var url = opt_url || this.DOCLIST_FEED + '?' + Util.stringify({'alt': 'json'});
  if (opt_callback) {
    this.makeRequest('GET', url, opt_callback.bind(this));
  } else {
    this.makeRequest('GET', url, this.render.bind(this));
  }
};

// GDocs.prototype.createFolder = function(title, opt_url, opt_callback) {
  
//   var url = opt_url || this.DRIVE_API;

//   // headers
//   var headers = {
//     "Content-Type": "application/json"
//   }

//   // a folder is just a file with a mimeType of 'application/vnd.google-apps.folder'
//   var params = new FormData()
//   params.append("title", title);
//   params.append("mimeType", "application/vnd.google-apps.folder");


//   if (opt_callback) {
//     this.makeRequest('POST', url, opt_callback.bind(this), params, headers);
//   } else {
//     this.makeRequest('POST', url, this.render.bind(this), params, headers);
//   }
// };

/**
 * Uploads a file to Google Docs.
 */
GDocs.prototype.upload = function(blob, callback) {
  var uploader = new ResumableUploader({
    accessToken: this.accessToken,
    file: blob
    //chunkSize: 1024*1024,
    //progressBar: document.getElementById('#progress')
  });

  var self = this;
  uploader.uploadFile({
    resumableMediaLink: this.CREATE_SESSION_URI/*,entry: entry*/
  }, function(response) {
    var entry = JSON.parse(response).entry;
    console.log(entry, entry.docs$filename.$t, entry.docs$size.$t);
    //self.getDocumentList();
  });
};

GDocs.prototype.render = function(lastResponse, xhr) {
  var resp = JSON.parse(lastResponse);

  var frag = document.createDocumentFragment();
  for (var i = 0, entry; entry = resp.feed.entry[i]; ++i) {
    var li = document.createElement('li');
    var icon = this.getLink(entry.link,
                            'http://schemas.google.com/docs/2007#icon').href;
    var alternate = this.getLink(entry.link, 'alternate').href;
    // TODO: crbug.com/120693. These anchors shouldn't need target="_blank".
    var html = ['<img src="', icon, '"> <a href="', alternate,
                '" target="_blank">', entry.title.$t, '</a>'];
    if (entry.docs$size) {
      html.push(' (' + entry.docs$size.$t + ' bytes)');
    }
    html.push(' ', Util.formatDate(entry.updated.$t));
    li.innerHTML = html.join('');
    frag.appendChild(li);
  }
  this.renderTarget.appendChild(frag);
};

