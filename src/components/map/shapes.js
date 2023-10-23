import 'ol/ol.css' // Import OpenLayers CSS
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { Stroke, Style } from 'ol/style'
import { parseRoutes, parseShapes } from '../utils/parser'
import { LineString } from 'ol/geom'
export default async function createShapesLayer() {
  const shapes = await parseShapes()

  // Create LineStrings for each shape_id
  const lines = Object.keys(shapes).map((shapeId) => {
    const coordinates = shapes[shapeId]
    return {
      linestring: new LineString(coordinates),
      line_name: shapeId
    }
  })

  const routes = await parseRoutes()

  const routeColorMap = new Map(
    routes.map((route) => [route.route_short_name.toString(), route.route_color])
  )

  // Add route_color to the first array where line_name matches route_short_name
  lines.forEach((item) => {
    if (routeColorMap.has(item.line_name.toString().slice(0, -4))) {
      item.route_color = routeColorMap.get(item.line_name.toString().slice(0, -4))
    } else if (routeColorMap.has(item.line_name.toString().slice(0, -5))) {
      item.route_color = routeColorMap.get(item.line_name.toString().slice(0, -5))
    }
  })

  // Create a VectorSource and add LineStrings as features
  const vectorSource = new VectorSource({
    features: lines.map((line) => {
      const feature = new Feature({ geometry: line.linestring })
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: '#' + line.route_color,
            width: 3
          })
        })
      )
      return feature
    })
  })

  return new VectorLayer({
    properties: {
      name: 'shapesLayer'
    },
    source: vectorSource
    /*minZoom: 16*/
  })
}
