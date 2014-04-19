"use strict"

var ndarray = require("ndarray")
var path = require("path")
var pngparse = require("pngparse")
var jpeg = require("jpeg-js")
var ppm = require("ppm")
var pack = require("ndarray-pack")
var GifReader = require("omggif").GifReader
var fs = require("fs")

function handlePNG(url, cb) {
  fs.readFile(url, function(err, data) {
    if(err) {
      cb(err)
      return
    }
    pngparse.parse(data, function(err, img_data) {
      if(err) {
        cb(err)
        return
      }
      cb(undefined, ndarray(new Uint8Array(img_data.data),
        [img_data.height|0, img_data.width|0, 4],
        [4*img_data.width|0, 4, 1],
        0))
    })
  })
}

function handlePPM(url, cb) {
  ppm.parse(fs.createReadStream(url), function(err, pixels) {
    if(err) {
      cb(err)
      return
    }
    var nshape = [ pixels.length, pixels[0].length, pixels[0][0].length ]
    var data = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
    var result = ndarray(data, nshape)
    pack(pixels, result)
    cb(undefined, result)
  })
}

function handleJPEG(url, cb) {
  fs.readFile(url, function(err, data) {
    if(err) {
      cb(err)
      return
    }
    var jpegData
    try {
      jpegData = jpeg.decode(data)
    }
    catch(e) {
      cb(e)
      return
    }
    if(!jpegData) {
      cb(new Error("Error decoding jpeg"))
      return
    }
    var nshape = [ jpegData.height, jpegData.width, 4 ]
    var result = ndarray(jpegData.data, nshape)
    cb(undefined, result)
  })
}

function handleGIF(url, cb) {
  fs.readFile(url, function(err, data) {
    if(err) {
      cb(err)
      return
    }
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
  })
}

module.exports = function getPixels(url, cb) {
  var ext = path.extname(url)
  switch(ext.toUpperCase()) {
    case ".PNG":
      handlePNG(url, cb)
    break
    
    case ".PPM":
      handlePPM(url, cb)
    break

    case ".JPE":
    case ".JPG":
    case ".JPEG":
      handleJPEG(url, cb)
    break

    case ".GIF":
      handleGIF(url, cb)
    break
    
    default:
      process.nextTick(function() {
        cb(new Error("Unsupported file type: " + ext))
      })
  }
}
