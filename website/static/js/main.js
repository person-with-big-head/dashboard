var $root= 'http://dashboard.tangobello.cn';
var md_editor;

(function($) {
  "use strict"; // Start of use strict
  // Configure tooltips for collapsed side navigation
  $('.navbar-sidenav [data-toggle="tooltip"]').tooltip({
    template: '<div class="tooltip navbar-sidenav-tooltip" role="tooltip">' +
              '<div class="arrow"></div>' +
              '<div class="tooltip-inner"></div>' +
              '</div>'
  });

  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
    $(".user-span").toggle();
  });

  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
    var e0 = e.originalEvent,
      delta = e0.wheelDelta || -e0.detail;
    this.scrollTop += (delta < 0 ? 1 : -1) * 30;
    e.preventDefault();
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Configure tooltips globally
  $('[data-toggle="tooltip"]').tooltip();

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

})(jQuery); // End of use strict


this.screenshotPreview = function(){

    var xOffset = 10;
    var yOffset = 30;

	$("a.screenshot").hover(function(e){
		this.t = this.title;
		this.title = "";
		var c = (this.t != "") ? "<br/>" + this.t : "";
		$("body").append("<p id='screenshot'><img src='"+ this.rel +"' alt='url preview' />"+ c +"</p>");
		$("#screenshot")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px")
            .css("width", "190px")
            .css("height", "190px")
            .css("overflow", "hidden")
            .fadeIn("fast");
		$("#screenshot img").css("width", "190px").css("height", "190px");
    },
	function(){
		this.title = this.t;
		$("#screenshot").remove();
    });
	$("a.screenshot").mousemove(function(e){
		$("#screenshot")
            .css("top",(e.pageY - xOffset) + "px")
            .css("left",(e.pageX + yOffset) + "px")
            .css("overflow", "hidden");
		$("#screenshot img").css("width", "190px").css("height", "190px");
	});
};


var inlineAttachment = function(options, instance) {
  this.settings = inlineAttachment.util.merge(options, inlineAttachment.defaults);
  this.editor = instance;
  this.filenameTag = '{filename}';
  this.lastValue = null;
};

/**
 * Will holds the available editors
 *
 * @type {Object}
 */
inlineAttachment.editors = {};

/**
 * Utility functions
 */
inlineAttachment.util = {

  /**
   * Simple function to merge the given objects
   *
   * @param {Object[]} object Multiple object parameters
   * @returns {Object}
   */
  merge: function() {
    var result = {};
    for (var i = arguments.length - 1; i >= 0; i--) {
      var obj = arguments[i];
      for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
          result[k] = obj[k];
        }
      }
    }
    return result;
  },

  /**
   * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
   *
   * @param {String} appended Current content
   * @param {String} previous Value which should be appended after the current content
   */
  appendInItsOwnLine: function(previous, appended) {
    return (previous + "\n\n[[D]]" + appended)
      .replace(/(\n{2,})\[\[D\]\]/, "\n\n")
      .replace(/^(\n*)/, "");
  },

  /**
   * Inserts the given value at the current cursor position of the textarea element
   *
   * @param  {HtmlElement} el
   * @param  {String} value Text which will be inserted at the cursor position
   */
  insertTextAtCursor: function(el, text) {
    var scrollPos = el.scrollTop,
      strPos = 0,
      browser = false,
      range;

    if ((el.selectionStart || el.selectionStart === '0')) {
      browser = "ff";
    } else if (document.selection) {
      browser = "ie";
    }

    if (browser === "ie") {
      el.focus();
      range = document.selection.createRange();
      range.moveStart('character', -el.value.length);
      strPos = range.text.length;
    } else if (browser === "ff") {
      strPos = el.selectionStart;
    }

    var front = (el.value).substring(0, strPos);
    var back = (el.value).substring(strPos, el.value.length);
    el.value = front + text + back;
    strPos = strPos + text.length;
    if (browser === "ie") {
      el.focus();
      range = document.selection.createRange();
      range.moveStart('character', -el.value.length);
      range.moveStart('character', strPos);
      range.moveEnd('character', 0);
      range.select();
    } else if (browser === "ff") {
      el.selectionStart = strPos;
      el.selectionEnd = strPos;
      el.focus();
    }
    el.scrollTop = scrollPos;
  }
};

/**
 * Default configuration options
 *
 * @type {Object}
 */
inlineAttachment.defaults = {
  /**
   * URL where the file will be send
   */
  uploadUrl: 'upload_attachment.php',

  /**
   * Which method will be used to send the file to the upload URL
   */
  uploadMethod: 'POST',

  /**
   * Name in which the file will be placed
   */
  uploadFieldName: 'file',

  /**
   * Extension which will be used when a file extension could not
   * be detected
   */
  defaultExtension: 'png',

  /**
   * JSON field which refers to the uploaded file URL
   */
  jsonFieldName: 'filename',

  /**
   * Allowed MIME types
   */
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif'
  ],

  /**
   * Text which will be inserted when dropping or pasting a file.
   * Acts as a placeholder which will be replaced when the file is done with uploading
   */
  progressText: '![Uploading file...]()',

  /**
   * When a file has successfully been uploaded the progressText
   * will be replaced by the urlText, the {filename} tag will be replaced
   * by the filename that has been returned by the server
   */
  urlText: "![file]({filename})",

  /**
   * Text which will be used when uploading has failed
   */
  errorText: "Error uploading file",

  /**
   * Extra parameters which will be send when uploading a file
   */
  extraParams: {},

  /**
   * Extra headers which will be send when uploading a file
   */
  extraHeaders: {},

  /**
   * Before the file is send
   */
  beforeFileUpload: function() {
    return true;
  },

  /**
   * Triggers when a file is dropped or pasted
   */
  onFileReceived: function() {},

  /**
   * Custom upload handler
   *
   * @return {Boolean} when false is returned it will prevent default upload behavior
   */
  onFileUploadResponse: function() {
    return true;
  },

  /**
   * Custom error handler. Runs after removing the placeholder text and before the alert().
   * Return false from this function to prevent the alert dialog.
   *
   * @return {Boolean} when false is returned it will prevent default error behavior
   */
  onFileUploadError: function() {
    return true;
  },

  /**
   * When a file has succesfully been uploaded
   */
  onFileUploaded: function() {}
};

/**
 * Uploads the blob
 *
 * @param  {Blob} file blob data received from event.dataTransfer object
 * @return {XMLHttpRequest} request object which sends the file
 */
inlineAttachment.prototype.uploadFile = function(file) {
  var me = this,
    formData = new FormData(),
    xhr = new XMLHttpRequest(),
    settings = this.settings,
    extension = settings.defaultExtension || settings.defualtExtension;

  if (typeof settings.setupFormData === 'function') {
    settings.setupFormData(formData, file);
  }

  // Attach the file. If coming from clipboard, add a default filename (only works in Chrome for now)
  // http://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
  if (file.name) {
    var fileNameMatches = file.name.match(/\.(.+)$/);
    if (fileNameMatches) {
      extension = fileNameMatches[1];
    }
  }

  var remoteFilename = "image-" + Date.now() + "." + extension;
  if (typeof settings.remoteFilename === 'function') {
    remoteFilename = settings.remoteFilename(file);
  }

  formData.append(settings.uploadFieldName, file, remoteFilename);

  // Append the extra parameters to the formdata
  if (typeof settings.extraParams === "object") {
    for (var key in settings.extraParams) {
      if (settings.extraParams.hasOwnProperty(key)) {
        formData.append(key, settings.extraParams[key]);
      }
    }
  }

  xhr.open('POST', settings.uploadUrl);

  // Add any available extra headers
  if (typeof settings.extraHeaders === "object") {
      for (var header in settings.extraHeaders) {
          if (settings.extraHeaders.hasOwnProperty(header)) {
              xhr.setRequestHeader(header, settings.extraHeaders[header]);
          }
      }
  }

  xhr.onload = function() {
    // If HTTP status is OK or Created
    if (xhr.status === 200 || xhr.status === 201) {
      me.onFileUploadResponse(xhr);
    } else {
      me.onFileUploadError(xhr);
    }
  };
  if (settings.beforeFileUpload(xhr) !== false) {
    xhr.send(formData);
  }
  return xhr;
};

/**
 * Returns if the given file is allowed to handle
 *
 * @param {File} clipboard data file
 */
inlineAttachment.prototype.isFileAllowed = function(file) {
  if (file.kind === 'string') { return true; }
  if (this.settings.allowedTypes.indexOf('*') === 0){
    return true;
  } else {
    return this.settings.allowedTypes.indexOf(file.type) >= 0;
  }
};

/**
 * Handles upload response
 *
 * @param  {XMLHttpRequest} xhr
 * @return {Void}
 */
inlineAttachment.prototype.onFileUploadResponse = function(xhr) {
  if (this.settings.onFileUploadResponse.call(this, xhr) !== false) {
    var result = JSON.parse(xhr.responseText),
      filename = result[this.settings.jsonFieldName];

    if (result && filename) {
      var newValue;
      if (typeof this.settings.urlText === 'function') {
        newValue = this.settings.urlText.call(this, filename, result);
      } else {
        newValue = this.settings.urlText.replace(this.filenameTag, filename);
      }
      var text = this.editor.getValue().replace(this.lastValue, newValue);
      this.editor.setValue(text);
      this.settings.onFileUploaded.call(this, filename);
    }
  }
};


/**
 * Called when a file has failed to upload
 *
 * @param  {XMLHttpRequest} xhr
 * @return {Void}
 */
inlineAttachment.prototype.onFileUploadError = function(xhr) {
  if (this.settings.onFileUploadError.call(this, xhr) !== false) {
    var text = this.editor.getValue().replace(this.lastValue, "");
    this.editor.setValue(text);
  }
};

/**
 * Called when a file has been inserted, either by drop or paste
 *
 * @param  {File} file
 * @return {Void}
 */
inlineAttachment.prototype.onFileInserted = function(file) {
  if (this.settings.onFileReceived.call(this, file) !== false) {
    this.lastValue = this.settings.progressText;
    this.editor.insertValue(this.lastValue);
  }
};


/**
 * Called when a paste event occured
 * @param  {Event} e
 * @return {Boolean} if the event was handled
 */
inlineAttachment.prototype.onPaste = function(e) {
  var result = false,
    clipboardData = e.clipboardData,
    items;

  if(!(e.clipboardData && e.clipboardData.items && e.clipboardData.items.length)){
      method.msg_layer({title:"提示", content:"该浏览器不支持图片的粘贴"});
      method.msg_close();
      return;
  }

  if (typeof clipboardData === "object") {
    items = clipboardData.items || clipboardData.files || [];


    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (this.isFileAllowed(item)) {
        result = true;
        this.onFileInserted(item.getAsFile());
        this.uploadFile(item.getAsFile());
      }else{
           method.msg_layer({title:"提示", content:"不支持的文件格式"});
           method.msg_close();
      }
    }
  }

  if (result) { e.preventDefault(); }

  return result;
};

/**
 * Called when a drop event occures
 * @param  {Event} e
 * @return {Boolean} if the event was handled
 */
inlineAttachment.prototype.onDrop = function(e) {
  var result = false;
  for (var i = 0; i < e.dataTransfer.files.length; i++) {
    var file = e.dataTransfer.files[i];
    if (this.isFileAllowed(file)) {
      result = true;
      this.onFileInserted(file);
      this.uploadFile(file);
    }else{
           method.msg_layer({title:"提示", content:"不支持的文件格式"});
           method.msg_close();
    }
  }

  return result;
};

window.inlineAttachment = inlineAttachment;


/**
* CodeMirror version for inlineAttachment
*
* Call inlineAttachment.attach(editor) to attach to a codemirror instance
*/

var codeMirrorEditor = function(instance) {

  if (!instance.getWrapperElement) {
    throw "Invalid CodeMirror object given";
  }

  this.codeMirror = instance;
};

codeMirrorEditor.prototype.getValue = function() {
  return this.codeMirror.getValue();
};

codeMirrorEditor.prototype.insertValue = function(val) {
  this.codeMirror.replaceSelection(val);
};

codeMirrorEditor.prototype.setValue = function(val) {
  var cursor = this.codeMirror.getCursor();
  this.codeMirror.setValue(val);
  this.codeMirror.setCursor(cursor);
};

/**
 * Attach InlineAttachment to CodeMirror
 *
 * @param {CodeMirror} codeMirror
 */
codeMirrorEditor.attach = function(codeMirror, options) {

  options = options || {};

  var editor = new codeMirrorEditor(codeMirror),
    inlineattach = new inlineAttachment(options, editor),
    el = codeMirror.getWrapperElement();

  el.addEventListener('paste', function(e) {
    inlineattach.onPaste(e);
  }, false);

  codeMirror.setOption('onDragEvent', function(data, e) {
    if (e.type === "drop") {
      e.stopPropagation();
      e.preventDefault();
      return inlineattach.onDrop(e);
    }
  });
};

var codeMirrorEditor4 = function(instance) {
  codeMirrorEditor.call(this, instance);
};

codeMirrorEditor4.attach = function(codeMirror, options) {

  options = options || {};

  var editor = new codeMirrorEditor(codeMirror),
    inlineattach = new inlineAttachment(options, editor),
    el = codeMirror.getWrapperElement();

  el.addEventListener('paste', function(e) {
    inlineattach.onPaste(e);
  }, false);

  codeMirror.on('drop', function(data, e) {
    if (inlineattach.onDrop(e)) {
      e.stopPropagation();
      e.preventDefault();
      return true;
    } else {
      return false;
    }
  });
};

inlineAttachment.editors.codemirror4 = codeMirrorEditor4;


function loadScript(url, callback){
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.body.appendChild(script);
}

function dialogConfirmAndCancel($title, $content, callback, $param){
    var $obj={
        type:"slideFromTop",
        close:"false",
        title:$title,
        content:$content,
        btn:["确定","取消"],
        callBack1:function(){
            callback($param);
        },
        callBack2:function(){
            method.msg_close();
        }
    };
    method.msg_layer($obj);
}