"use strict"

var ndarray = require("ndarray")
var path = require("path")
var pngparse = require("pngparse")
var ppm = require("ppm")
var pack = require("ndarray-pack")
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
    cb(undefined, pack(pixels, "uint8"))
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
    
    default:
      process.nextTick(function() {
        cb(new Error("Unsupported file type: " + ext))
      })
  }
}
