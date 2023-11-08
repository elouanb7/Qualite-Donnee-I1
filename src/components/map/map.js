import 'ol/ol.css' // Import OpenLayers CSS
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
import createBusLayer from './bus'
import { Overlay } from 'ol'
import createShapesLayer from './shapes'

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
        source: new OSM()
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
      let divContent = ''

      feature.routes.forEach(function (item) {
        divContent +=
          "<div style='margin: 0 2px; width: 40px; text-align: center; padding: 0 10px; color: #fff; background-color: #" +
          item.route_color +
          "'>" +
          item.route_name +
          '</div>'
      })

      content.innerHTML =
        '<p> Arrêt : <code>' +
        feature.name +
        '</code><br>Accès handicapé : <code>' +
        (feature.wheelchair === 1 ? 'Oui' : 'Non') +
        '</code><br>Lignes : <br>' +
        '<div style="max-width: 240px">' +
        '<div id="linesDiv" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 15px; justify-content: flex-start;"></div>' +
        '</div></p>'

      overlay.setPosition(event.coordinate)
      document.getElementById('linesDiv').insertAdjacentHTML('beforeend', divContent)
    }
  })

  map.addLayer(await createBusLayer())
  map.addLayer(await createShapesLayer())
}
