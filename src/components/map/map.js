import 'ol/ol.css' // Import OpenLayers CSS
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import createBusLayer from './bus'

export default async function createMap() {
  // Create the map
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat([-1.5419, 47.2123]), // Center coordinates
      zoom: 12 // Zoom level
    })
  })

  map.addLayer(await createBusLayer())
}
