"use strict"
var test = require("tap").test

var path = require("path")
var getPixels = require("../node-pixels.js")

function test_image(t, img) {
  t.equals(img.shape[0], 16)
  t.equals(img.shape[1], 8)
  t.equals(img.get(0, 0, 0), 0)
  t.equals(img.get(0, 0, 1), 0)
  t.equals(img.get(0, 0, 2), 0)
  t.equals(img.get(1, 0, 0), 0xff)
  t.equals(img.get(1, 0, 1), 0)
  t.equals(img.get(1, 0, 2), 0)
  t.equals(img.get(2, 0, 0), 0xff)
  t.equals(img.get(2, 0, 1), 0xff)
  t.equals(img.get(2, 0, 2), 0)
  t.equals(img.get(3, 0, 0), 0xff)
  t.equals(img.get(3, 0, 1), 0)
  t.equals(img.get(3, 0, 2), 0xff)
  t.equals(img.get(0, 1, 0), 0)
  t.equals(img.get(0, 1, 1), 0xff)
  t.equals(img.get(0, 1, 2), 0)
  t.equals(img.get(1, 1, 0), 0)
  t.equals(img.get(1, 1, 1), 0xff)
  t.equals(img.get(1, 1, 2), 0xff)
  t.equals(img.get(0, 2, 0), 0)
  t.equals(img.get(0, 2, 1), 0)
  t.equals(img.get(0, 2, 2), 0xff)
  
  for(var i=4; i<8; ++i) {
    for(var j=0; j<16; ++j) {
      t.equals(img.get(j, i, 0), 0xff)
      t.equals(img.get(j, i, 1), 0xff)
      t.equals(img.get(j, i, 2), 0xff)
    }
  }
}

test("get-pixels", function(t) {
  getPixels(path.join(__dirname, "lena.png"), function(err, pixels) {
    if(err) {
      t.assert(false)
    } else {
      t.equals(pixels.shape.join(","), "512,512,4")
    }
    t.end()
  })
})

test("get-pixels-png", function(t) {
  getPixels(path.join(__dirname, "test_pattern.png"), function(err, pixels) {
    test_image(t, pixels)
    t.end()
  })
})

test("get-pixels-ppm", function(t) {
  getPixels(path.join(__dirname, "test_pattern.ppm"), function(err, pixels) {
    console.log(pixels.shape)
    test_image(t, pixels)
    t.end()
  })
})


