"use strict"

var ndarray = require("ndarray")
var ops = require("ndarray-ops")

module.exports = function getPixels(url, cb) {
  var img = new Image()
  img.onload = function() {
    var canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    var context = canvas.getContext("2d")
    context.drawImage(img)
    var pixels = context.getImageData(0, 0, img.width, img.height)
    var buffer = ndarray.zeros([img.width, img.height, 4], "uint8", [1, 2, 0])
    ops.assign(buffer, ndarray.ctor(pixels.data, [img.width, img.height, 4], [4, img.width, 1], 0))
    cb(null, buffer)
  }
  img.onerror = function(err) {
    cb(err)
  }
  img.src = url
}
