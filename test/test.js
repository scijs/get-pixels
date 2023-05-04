"use strict"
var test = require("tape")

var fs   = require("fs")
var path = require("path")
var ndarray = require("ndarray")
var getPixels = require("../dom-pixels.js");

var EXPECTED_IMAGE = ndarray(
[0,0,0,255,255,0,0,255,255,255,0,255,255,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,255,0,255,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,0,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255],[16,8,4],[4,64,1])

function test_image(t, img, tol) {
  t.equals(img.shape[0], 16)
  t.equals(img.shape[1], 8)

  for(var i=0; i<16; ++i) {
    for(var j=0; j<8; ++j) {
      for(var k=0; k<3; ++k) {
        if(tol) {
          t.ok(Math.abs(img.get(i,j,k)-EXPECTED_IMAGE.get(i,j,k)) < tol)
        } else {
          t.equals(img.get(i,j,k), EXPECTED_IMAGE.get(i,j,k))
        }
      }
    }
  }
}

test("get-pixels", function(t) {
  getPixels("test/lena.png", function(err, pixels) {
    if(err) {
      t.assert(false)
    } else {
      t.equals(pixels.shape.join(","), "512,512,4")
    }
    t.end()
  })
})

test("get-pixels-png", function(t) {
  getPixels("test/test_pattern.png", function(err, pixels) {
    if(err) {
      t.error(err, "failed to parse png")
      t.end()
      return
    }
    test_image(t, pixels)
    t.end()
  })
})

/*
test("get-pixels-ppm", function(t) {
  getPixels(path.join(__dirname, "test_pattern.ppm"), function(err, pixels) {
    if(err) {
      t.error(err, "failed to parse ppm")
      t.end()
      return
    }
    test_image(t, pixels)
    t.end()
  })
})
*/

test("get-pixels-jpg", function(t) {
  getPixels("test/test_pattern.jpg", function(err, pixels) {
    if(err) {
      t.error(err, "failed to parse jpg")
      t.end()
      return
    }
    test_image(t, pixels, 4)
    t.end()
  })
})

test("get-pixels-gif", function(t) {
  getPixels("test/test_pattern.gif", function(err, pixels) {
    if(err) {
      t.error(err, "failed to parse gif")
      t.end()
      return
    }
    test_image(t, pixels.pick(0))
    t.end()
  })
})

/*
test("get-pixels-bmp", function(t) {
  getPixels(path.join(__dirname, "test_pattern.bmp"), function(err, pixels) {
    if(err) {
      t.error(err, "failed to parse bmp")
      t.end()
      return
    }
    test_image(t, pixels)
    t.end()
  })
})
*/

test("data url", function(t) {
  var url = "data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7"
  getPixels(url, function(err, data) {
    if(err) {
      console.log(err)
      t.error("failed to read data url")
      t.end()
      return
    }
    t.ok(true, 'data url opened without crashing')
    t.end()
  })
})

test("get-pixels-buffer", function(t) {
  var buffer = fs.readFileSync(__dirname + "/test_pattern.png")
  getPixels(buffer, "image/png", function(err, pixels) {
    if(err) {
      t.error(err, "failed to parse buffer")
      t.end()
      return
    }
    test_image(t, pixels)
    t.end()
  })
})

test("get-url png img", function(t) {
  var url = "https://raw.githubusercontent.com/scijs/get-pixels/master/test/test_pattern.png";
  getPixels(url, function(err, pixels){
    if(err) {
      console.log("Error:", err);
      t.error(err, "failed to read web image data");
      t.end();
      return;
    }
    test_image(t, pixels);
    t.end();
  });
});

test("get-url jpg img", function(t) {
  var url = "https://raw.githubusercontent.com/scijs/get-pixels/master/test/test_pattern.jpg";
  getPixels(url, function(err, pixels){
    if(err) {
      console.log("Error:", err);
      t.error(err, "failed to read web image data");
      t.end();
      return;
    }
    test_image(t, pixels);
    t.end();
  });
});

test("get-url gif img", function(t) {
  var url = "https://raw.githubusercontent.com/scijs/get-pixels/master/test/test_pattern.gif";
  getPixels(url, function(err, pixels){
    if(err) {
      console.log("Error:", err);
      t.error(err, "failed to read web image data");
      t.end();
      return;
    }
    test_image(t, pixels.pick(0));
    t.end();
  });
});
