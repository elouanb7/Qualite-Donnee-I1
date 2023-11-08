import axios from 'axios'
import { fromLonLat } from 'ol/proj'

export async function parseStops() {
  return axios
    .get('src/data/stops.json')
    .then(async (response) => {
      let stops = response.data
      stops = stops.filter((element) => element.stop_id.length === 4)
      const shapes = await parseRawShapes()
      stops = await associateShapesStops(shapes, stops)
      return stops.map((stop) => ({
        coordinates: fromLonLat([stop.stop_lon, stop.stop_lat]),
        name: stop.stop_name,
        id: stop.stop_id,
        wheelchair: stop.wheelchair_boarding,
        routes: stop.routes
      }))
    })
    .catch((error) => {
      console.error('Error fetching JSON data:', error)
      return []
    })
}

export async function parseRoutes() {
  return axios
    .get('src/data/routes.json')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching JSON data:', error)
      return []
    })
}

export async function parseShapes() {
  try {
    const response = await axios.get('src/data/shapes.json')
    const data = response.data

    // Group shape points by shape_id
    const shapePointsByShapeId = {}
    data.forEach((point) => {
      const shapeId = point.shape_id
      if (!shapePointsByShapeId[shapeId]) {
        shapePointsByShapeId[shapeId] = []
      }
      shapePointsByShapeId[shapeId].push(fromLonLat([point.shape_pt_lon, point.shape_pt_lat]))
    })

    return shapePointsByShapeId
  } catch (error) {
    console.error('Error fetching JSON data:', error)
    return null
  }
}

async function parseRawShapes() {
  return axios
    .get('src/data/shapes.json')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching JSON data:', error)
      return []
    })
}

async function associateShapesStops(shapesData, stopsData) {
  const shapeIdMap = new Map()

  const routes = await parseRoutes()

  const routesMap = new Map(
    routes.map((route) => [
      route.route_short_name.toString(),
      [route.route_color, route.route_text_color]
    ])
  )

  shapesData.forEach((shape) => {
    const key = `${shape.shape_pt_lat}:${shape.shape_pt_lon}`
    if (!shapeIdMap.has(key)) {
      shapeIdMap.set(key, [])
    }
    if (routesMap.has(shape.shape_id.toString().slice(0, -4))) {
      const shapeId = shape.shape_id.toString().slice(0, -4)
      const routeColors = routesMap.get(shapeId)
      const pair = {
        route_name: shapeId,
        route_color: routeColors[0],
        route_text_color: routeColors[1]
      }
      // Add the pair to the shape_ids array if it's not already included
      if (!shapeIdMap.get(key).some(({ route }) => route === shapeId)) {
        shapeIdMap.get(key).push(pair)
      }
    } else if (routesMap.has(shape.shape_id.toString().slice(0, -5))) {
      const shapeId = shape.shape_id.toString().slice(0, -5)
      const routeColors = routesMap.get(shapeId)
      const pair = {
        route_name: shapeId,
        route_color: routeColors[0],
        route_text_color: routeColors[1]
      }
      // Add the pair to the shape_ids array if it's not already included
      if (!shapeIdMap.get(key).some(({ route }) => route === shapeId)) {
        shapeIdMap.get(key).push(pair)
      }
    }
  })

  for (let i = 0; i < stopsData.length; i++) {
    const stop = stopsData[i]
    const key = `${stop.stop_lat}:${stop.stop_lon}`
    if (shapeIdMap.has(key)) {
      stop.routes = shapeIdMap.get(key)
    }
  }
  return stopsData
}
