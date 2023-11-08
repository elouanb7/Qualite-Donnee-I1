<template>
  <div>
    <div id="map" style="height: 700px"></div>
  </div>
</template>

<script>
import createMap from './map/map.js'

export default {
  name: 'MapBase',
  // data() {
  //   return {
  //     isMounted: false
  //   }
  // },
  async mounted() {
    await createMap()
    // .then(() => (this.isMounted = true))
  }
}
</script>
