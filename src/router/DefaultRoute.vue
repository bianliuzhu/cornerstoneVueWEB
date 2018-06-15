<template>
  <div class="page-container">
    <h1>{{msg}}</h1>

    <cornerstone-canvas></cornerstone-canvas>

    <h3>Features</h3>
    <table>
      <thead>
        <tr>
          <th>Mouse</th>
          <th>Touch</th>
          <th>Behavior</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Left Click + Drag</td>
          <td>One Finger Touch + Drag</td>
          <td>Adjust window width and center</td>
        </tr>
        <tr>
          <td>Middle Click + Drag</td>
          <td>Two Finger Touch + Drag</td>
          <td>Pan / Drag Image</td>
        </tr>
        <tr>
          <td>Right Click + Drag</td>
          <td>Two Finger + Pinch/Expand</td>
          <td>Zoom / Scale Image</td>
        </tr>
        <tr>
          <td>Mouse Wheel Scroll</td>
          <td>Two Finger Scroll</td>
          <td>Iterate over images in stack</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import CornerstoneCanvas from './../components/CornerstoneCanvas'

export default {
  name: 'DefaultRoute',
  components: {
    CornerstoneCanvas
  },
  data () {
    return {
      msg: 'Hello Cornerstone (:'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  width: 100%;
  text-align: left;
  border-spacing: 0;
  border: 1px solid #ddd;
  border-collapse: collapse;
}

thead {
  border-color: inherit;
  vertical-align: middle;
}

tr {
  vertical-align: inherit;
  border-color: inherit;
}

th, td {
  padding: 8px;
  line-height: 1.42857143;
}

th {
  vertical-align: bottom;
  border-bottom-width: 2px;
}

td {
  vertical-align: top;
  border: 1px solid #ddd;
}

.table > thead:first-child > tr:first-child > th {
    border-top: 0;
}
</style>
