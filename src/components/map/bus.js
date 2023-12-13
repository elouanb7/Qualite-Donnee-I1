import 'ol/ol.css' // Import OpenLayers CSS
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import { parseStops } from '../utils/parser'
// Import necessary components from vue3-google-map
import { createApp, ref, watch } from 'vue'
import { GMap, GMapMarker, useGMapApi } from 'vue3-google-map'

export default async function createBusLayer() {
  const points = await parseStops()
  const map = ref(null)

  const vectorSource = new VectorSource({
    features: await Promise.all(
      points.map(async (point) => {
        // Fetch Google Street View image
        const streetViewImage = await getStreetViewImage(map, point.coordinates)

        const feature = new Feature({
          geometry: new Point(point.coordinates)
        })
        feature.setStyle(
          new Style({
            image: new Icon({
              color: 'white',
              crossOrigin: 'anonymous',
              src: 'src/assets/icons/bus-marker.svg',
              size: [32, 32],
              anchor: [0.5, 1]
            })
          })
        )
        feature.set('routes', point.routes)
        feature.set('name', point.name)
        feature.set('id', point.id)
        feature.set('wheelchair', point.wheelchair)
        feature.set('streetViewImage', streetViewImage) // Add streetViewImage property
        return feature
      })
    )
  })

  // Watch for map changes
  watch(map, (newMap) => {
    if (newMap) {
      // Do any additional map-related setup here
    }
  })

  return new VectorLayer({
    properties: {
      name: 'busLayer'
    },
    source: vectorSource,
    minZoom: 16
  })
}

async function getStreetViewImage(map, coordinates) {
  // See the vue3-google-map documentation for details: https://www.npmjs.com/package/vue3-google-map
  const app = createApp({})
  app.component('GMap', GMap)
  app.component('GMapMarker', GMapMarker)
  app.mount('#app') // Make sure to replace '#app' with your actual app mount element

  const { value: google } = useGMapApi()

  const service = new google.maps.StreetViewService()
  const position = new google.maps.LatLng(coordinates[1], coordinates[0])

  return new Promise((resolve) => {
    service.getPanorama({ location: position, radius: 50 }, (data, status) => {
      if (status === 'OK') {
        const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${coordinates[1]},${coordinates[0]}&fov=90&heading=235&pitch=10&key=YOUR_GOOGLE_MAPS_API_KEY`
        resolve(imageUrl)
      } else {
        resolve(null)
      }
    })
  })
}
