<template>
  <div>
    <div id="map" style="height: 700px"></div>
  </div>
</template>

<script>
import 'ol/ol.css' // Import OpenLayers CSS
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import { Style, Icon } from 'ol/style'

export default {
  name: 'MapBase',
  mounted() {
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

    // Add points from your database
    const points = [
      {
        coordinates: fromLonLat([-1.5419, 47.2123]),
        name: 'Point 1'
      },
      {
        coordinates: fromLonLat([-1.5419, 47.2126]),
        name: 'Point 2'
      }
    ]

    const vectorSource = new VectorSource({
      features: points.map((point) => {
        const feature = new Feature({
          geometry: new Point(point.coordinates)
        })
        feature.set('name', point.name)
        return feature
      })
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'src/assets/icons/bus-marker.svg' // Customize with your own icon
        })
      })
    })

    map.addLayer(vectorLayer)
  }
}
</script>
