<template>
  <!-- WRAPPER -->
  <div
    class="image-canvas-wrapper"
    oncontextmenu="return false"
    unselectable='on'
    onselectstart='return false;'
    onmousedown='return false;'
  >

    <!-- DICOM CANVAS -->
    <div
      ref="canvas"
      class="image-canvas"
      oncontextmenu="return false"
    ></div>

  </div>

</template>

<script>
// External Dependencies
import $ from "jquery";
import Hammer from "hammerjs";
import * as cornerstoneMath from "cornerstone-math";

// Cornerstone Libraries
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

// Specify external dependencies
// TODO: Cornerstone really should show a better error message when these aren't set
// It's worth noting that you only need these when the cornerstone libraries are loaded as modules.
// I'm 90% sure, when loaded with script tags, everything assumes global scope
cornerstone.external.$ = $;
cornerstoneTools.external.$ = $;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.$ = $;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWebImageLoader.external.cornerstoneMath = cornerstoneMath;

// Here is how you register an image loader w/ Cornerstone
// Under the hood, this image loader is also registering a "metaDataProvider"
// Each of these has an interface you can program against to create a custom
// Image loader, or metaDataProvider if you need to get data/images into cornerstone
cornerstone.registerImageLoader("http", cornerstoneWebImageLoader.loadImage);
cornerstone.registerImageLoader("https", cornerstoneWebImageLoader.loadImage);

export default {
  name: "CornerstoneCanvas",
  data() {
    return {
      baseUrl: "http://localhost:8585",
      // Pass in as a property, or use a computed property that looks at Vuex
      // Then... Watch for changes. On change, load the new series
      exampleStudyImageIds: [
        "/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.4.jpg",
        "/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.5.jpg",
        "/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.6.jpg",
        "/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.7.jpg",
        "/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.9.jpg",
        "/static/simple-study/1.2.276.0.74.3.1167540280.200511.112514.1.1.10.jpg"
      ],
      isInitLoad: true
    };
  },
  mounted() {
    let _self = this;
    // this.listenForCornerstoneImageRendered()
    // this.listenForCornerstoneImageLoaded()
    this.listenForWindowResize();

    // Enable Canvas
    let canvas = this.$refs.canvas;
    cornerstone.enable(canvas);

    // ImageId that matches our registered image loader's 'http:' prefix
    // The webImageLoader uses this to make an xhr request to fetch an image
    // Under the hood, it creates a cornerstone "Image" object needed for display
    const imageUrl = this.baseUrl + this.exampleStudyImageIds[0];
    cornerstone.loadImage(imageUrl).then(function(image) {
      // Display our loaded image on the target canvas
      cornerstone.displayImage(canvas, image);

      // TODO: It really should be possible to "turn on tools" before an image is loaded
      if (_self.isInitLoad) {
        _self.initCanvasTools();
      }
    });
  },
  beforeDestroy() {
    // Remove jQuery event listeners
    let canvas = this.$refs.canvas;
    $(canvas).off();
  },
  methods: {
    initCanvasTools: function() {
      let _self = this;
      let canvas = this.$refs.canvas;
      console.log(canvas);
      this.isInitLoad = false;

      // Find imageIds for canvasStack
      let allImageIds = [];

      this.exampleStudyImageIds.forEach(function(imageId) {
        let imageUrl = _self.baseUrl + imageId;
        allImageIds.push(imageUrl);
      });
      console.log(allImageIds);
      // Create canvasStack
      let canvasStack = {
        currentImageIdIndex: 0,
        imageIds: allImageIds
      };

      // Enable Inputs
      cornerstoneTools.mouseInput.enable(canvas);
      cornerstoneTools.mouseWheelInput.enable(canvas);
      cornerstoneTools.touchInput.enable(canvas);

      // Set the stack as tool state
      cornerstoneTools.addStackStateManager(canvas, ["stack"]);
      cornerstoneTools.addToolState(canvas, "stack", canvasStack);
      cornerstoneTools.stackScrollWheel.activate(canvas); // Mouse wheel
      cornerstoneTools.scrollIndicator.enable(canvas); // Position indicator

      // Mouse
      cornerstoneTools.wwwc.activate(canvas, 1); // left click
      cornerstoneTools.pan.activate(canvas, 2); // middle click
      cornerstoneTools.zoom.activate(canvas, 4); // right click

      // Touch / Gesture
      cornerstoneTools.wwwcTouchDrag.activate(canvas); // - Drag
      cornerstoneTools.zoomTouchPinch.activate(canvas); // - Pinch
      cornerstoneTools.panMultiTouch.activate(canvas); // - Multi (x2)
    },
    /*
     * Window Resize
     *
    */
    listenForWindowResize: function() {
      this.$nextTick(function() {
        window.addEventListener(
          "resize",
          this.debounce(this.onWindowResize, 100)
        );
      });
    },
    onWindowResize: function() {
      cornerstone.resize(this.$refs.canvas, true);
    },
    /*
     * Utility Methods
     *
    */
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this;
        var args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.image-canvas-wrapper {
  width: 100%;
  height: 525px;
}

.image-canvas {
  width: 100%;
  height: 100%;
}
</style>
