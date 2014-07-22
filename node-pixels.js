"use strict"

var ndarray = require("ndarray")
var path = require("path")
var pngparse = require("pngparse")
var jpeg = require("jpeg-js")
var ppm = require("ppm")
var pack = require("ndarray-pack")
var GifReader = require("omggif").GifReader
var Bitmap = require("node-bitmap")
var fs = require("fs")
var request = require("request")

function handlePNG(data, cb) {
    pngparse.parse(data, function(err, img_data) {
      if(err) {
        cb(err)
        return
      }
      cb(null, ndarray(new Uint8Array(img_data.data),
        [img_data.height|0, img_data.width|0, 4],
        [4*img_data.width|0, 4, 1],
        0))
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
    cb(null, result)
  })
}

function handleJPEG(data, cb) {
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
    cb(null, result)
}

function handleGIF(data, cb) {
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
      cb(null, result)
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
      cb(null, result)
    }
}

function handleBMP(data, cb) {
    var bmp = new Bitmap(data)
    try {
      bmp.init()
    } catch(e) {
      cb(e)
      return
    }
    var bmpData = bmp.getData()
    var nshape = [ bmpData.getHeight(), bmpData.getWidth(), 4 ]
    var ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
    var result = ndarray(ndata, nshape)
    pack(bmpData, result)
    cb(null, result)
}

function readData(url, cb) {
  if (url.substring(0,4) == "http") {
    var options = {
      method: 'GET',
      url: url,
      encoding: null
    };

    request(options, function(error, response, body) {
      if (error) {
        cb(error);
        return;
      }
      cb(null, body);
    })
  } else {
    //local file
    fs.readFile(url, function(err, data) {
      if(err) {
        cb(err);
        return;
      }
       cb(null, data);
    })
  }

}



module.exports = function getPixels(url, cb) {
  readData(url, function(err, data) {
    if (err) {
      cb(err)
      return
    }

  var ext = path.extname(url)
  switch(ext.toUpperCase()) {
    case ".PNG":
      handlePNG(data, cb)
    break

    case ".PPM":
      handlePPM(url, cb) //TODO
    break

    case ".JPE":
    case ".JPG":
    case ".JPEG":
      handleJPEG(data, cb)
    break

    case ".GIF":
      handleGIF(data, cb)
    break

    case ".BMP":
      handleBMP(data, cb)
    break

    default:
      process.nextTick(function() {
        cb(new Error("Unsupported file type: " + ext))
      })
  }

  })


}
