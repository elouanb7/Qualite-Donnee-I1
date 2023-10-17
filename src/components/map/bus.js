import 'ol/ol.css' // Import OpenLayers CSS
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import { parseStops } from '../utils/parser'
export default async function createBusLayer() {
  const points = await parseStops()

  const vectorSource = new VectorSource({
    features: points.map((point) => {
      const feature = new Feature({
        geometry: new Point(point.coordinates)
      })
      feature.setStyle(
        new Style({
          image: new Icon({
            color: 'white',
            crossOrigin: 'anonymous',
            src: 'src/assets/icons/bus-marker.svg',
            size: [32, 32], // Set the desired size
            anchor: [0.5, 1]
          })
        })
      )
      feature.set('name', point.name)
      feature.set('id', point.id)
      return feature
    })
  })

  return new VectorLayer({
    properties: {
      name: 'busLayer'
    },
    source: vectorSource,
    minZoom: 16
  })
}
