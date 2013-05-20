get-pixels
==========
Given a URL/path, grab all the pixels in an image and return the result as an [ndarray](https://github.com/mikolalysenko/ndarray).  Works both in browserify and in node.js.

**Note** On the node side, currently only supports PNG and PPM.  Patches welcome!!!

Example
=======

```javascript
var getPixels = require("get-pixels")

getPixels("lena.png", function(err, pixels) {
  if(err) {
    console.log("Bad image path")
    return
  }
  console.log("got pixels", pixels.shape)
})
```

Install
=======

    npm install get-pixels

### `require("get-pixels")(url, cb(err, pixels))`
Reads all the pixels from url into an ndarray.

* `url` is the path to the file
* `cb(err, pixels)` is a callback which gets triggered once the image is loaded.

**Returns** An ndarray of pixels in raster order having shape equal to `[rows, columns, channels]`.

Credits
=======
(c) 2013 Mikola Lysenko. MIT License