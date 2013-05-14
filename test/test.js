"use strict"

var path = require("path")
var getPixels = require("../node-pixels.js")

require("tap").test("get-pixels", function(t) {
  getPixels(path.join(__dirname, "lena.png"), function(err, pixels) {
    if(err) {
      t.assert(false)
    } else {
      t.equals(pixels.shape.join(","), "512,512,4")
    }
    t.end()
  })
})