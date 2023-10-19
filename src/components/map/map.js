import 'ol/ol.css' // Import OpenLayers CSS
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import createBusLayer from './bus'
import { Overlay } from 'ol'
import createShapesLayer from './shapes'
import { XYZ } from 'ol/source'

const container = document.getElementById('popup')
const content = document.getElementById('popup-content')
const closer = document.getElementById('popup-closer')

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250
    }
  }
})

closer.onclick = function () {
  overlay.setPosition(undefined)
  closer.blur()
  return false
}

export default async function createMap() {
  // Create the map
  const map = new Map({
    overlays: [overlay],
    target: 'map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=hUi4K4fnSi0gIkMiVUo2N9voob4eg23D22SexW1nIdM73fBSA7wmMNg8gBHnLEAt'
        })
      })
    ],
    view: new View({
      center: fromLonLat([-1.5419, 47.2123]), // Center coordinates
      zoom: 12 // Zoom level
    })
  })

  map.on('click', function (event) {
    let features = []
    let pixel = map.getPixelFromCoordinate(event.coordinate)
    map.forEachFeatureAtPixel(
      pixel,
      function (feature) {
        features.push(feature)
      },
      {
        layerFilter: function () {
          return map
            .getLayers()
            .getArray()
            .find(function (layer) {
              return layer.get('name') === 'busLayer'
            })
        },
        hitTolerance: 10
      }
    )

    if (features.length > 0) {
      let feature = features[0].values_
      content.innerHTML =
        '<p> Arrêt : <code>' +
        feature.name +
        '</code><br>Accès handicapé : <code>' +
        (feature.wheelchair === 1 ? 'Oui' : 'Non') +
        '</code></p>'
      overlay.setPosition(event.coordinate)
    }
  })

  map.addLayer(await createBusLayer())
  map.addLayer(await createShapesLayer())
}
