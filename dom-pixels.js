"use strict"

var path = require("path")
var ndarray = require("ndarray")
var GifReader = require("omggif").GifReader

function defaultImage(url, cb) {
  var img = new Image()
  img.onload = function() {
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    var context = canvas.getContext("2d")
    context.drawImage(img, 0, 0)
    var pixels = context.getImageData(0, 0, img.width, img.height)
    cb(null, ndarray(new Uint8Array(pixels.data), [img.height, img.width, 4], [4*img.width, 4, 1], 0))
  }
  img.onerror = function(err) {
    cb(err)
  }
  img.src = url
}

//Animated gif loading
function handleGIF(url, cb) {
  var xhr = new XMLHttpRequest()
  xhr.responseType = "arraybuffer"
  xhr.onerror = function(err) {
    cb(err)
  }
  xhr.onreadystatechange = function() {
    if(xhr.readyState !== 4) {
      return
    }
    var data = new Uint8Array(xhr.response)
    var reader
    try {
      reader = new GifReader(data)
    } catch(err) {
      cb(err)
      return
    }
    if(reader.numFrames > 0) {
      var nshape = [reader.numFrames, reader.height, reader.width, 4]
      var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3])
      var result = ndarray(ndata, nshape)
      try {
        for(var i=0; i<reader.numFrames; ++i) {
          reader.decodeAndBlitFrameRGBA(i, ndata.subarray(
            result.index(i, 0, 0, 0),
            result.index(i+1, 0, 0, 0)))
        }
      } catch(err) {
        cb(err)
        return
      }
      cb(undefined, result)
    } else {
      var nshape = [reader.height, reader.width, 4]
      var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
      var result = ndarray(ndata, nshape)
      try {
        reader.decodeAndBlitFrameRGBA(0, ndata)
      } catch(err) {
        cb(err)
        return
      }
      cb(undefined, result)
    }
  }
  xhr.open("get", url, true)
}

module.exports = function getPixels(url, cb) {
  var ext = path.extname(url)
  switch(ext.toUpperCase()) {
    case "GIF":
      handleGIF(url, cb)
    break
    default:
      defaultImage(url, cb)
  }
}
