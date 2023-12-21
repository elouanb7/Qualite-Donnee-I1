import 'ol/ol.css' // Import OpenLayers CSS
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import { parseStops } from '../utils/parser'

const liste_tram = ['1', '2', '3', '4', '5']

function setStyle(feature, value) {
  feature.setStyle(
    new Style({
      image: new Icon({
        color: 'white',
        crossOrigin: 'anonymous',
        src: value,
        size: [32, 32], // Set the desired size
        anchor: [0.5, 1]
      })
    })
  )
}
export default async function createBusLayer() {
  const points = await parseStops()
  const vectorSource = new VectorSource({
    features: points.map((point) => {
      const feature = new Feature({
        geometry: new Point(point.coordinates)
      })
      console.log(point)
      if (point.routes.length === 1) {
        setStyle(feature, liste_tram.includes(point.routes[0].route_name) ? 'src/assets/icons/tram.svg' : 'src/assets/icons/bus.svg');
      } else {
        const hasBus = point.routes.some(object => !liste_tram.includes(object.route_name));
        const hasTram = point.routes.some(object => liste_tram.includes(object.route_name));

        setStyle(feature, hasBus && !hasTram ? 'src/assets/icons/bus.svg' : 'src/assets/icons/train-bus.svg');
      }

      feature.set('routes', point.routes)
      feature.set('name', point.name)
      feature.set('id', point.id)
      feature.set('wheelchair', point.wheelchair)
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
