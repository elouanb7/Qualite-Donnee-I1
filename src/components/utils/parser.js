import axios from 'axios'
import { fromLonLat } from 'ol/proj'

export async function parseStops() {
  return axios
    .get('src/data/stops.json')
    .then(async (response) => {
      let stops = response.data
      stops = await combineStops(stops)
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

export async function parseStopsFromAPI() {
  return axios
    .get('https://open.tan.fr/ewp/arrets.json')
    .then(async (response) => {
      let stops = response.data
      return stops
      /*const shapes = await parseRawShapes()
      stops = await associateShapesStops(shapes, stops)
      return stops.map((stop) => ({
        coordinates: fromLonLat([stop.stop_lon, stop.stop_lat]),
        name: stop.stop_name,
        id: stop.stop_id,
        wheelchair: stop.wheelchair_boarding,
        routes: stop.routes
      }))*/
    })
    .catch((error) => {
      console.error('Error fetching API data:', error)
      return []
    })
}

export async function combineStops(stops) {
  const apiStops = await parseStopsFromAPI()
  stops = new Map(stops.map((stop) => [stop.stop_id, stop]))

  return apiStops
    .map((apiStop) => {
      const stop = stops.get(apiStop.codeLieu)
      if (stop) {
        return {
          stop_id: apiStop.codeLieu,
          stop_name: apiStop.libelle,
          stop_lat: stop.stop_lat,
          stop_lon: stop.stop_lon,
          wheelchair: stop.wheelchair_boarding,
          routes: apiStop.ligne.map((ligne) => ligne.numLigne)
        }
      } else {
        return null
      }
    })
    .filter(Boolean)
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

  for (const stop of stopsData) {
    stop.routes = stop.routes
      .map((route) => {
        const routeValues = routesMap.get(route)
        if (routeValues) {
          const [routeColor, routeTextColor] = routeValues
          return {
            route_name: route,
            route_color: routeColor,
            route_text_color: routeTextColor
          }
        }
        return null
      })
      .filter(Boolean)
  }

  /*shapesData.forEach((shape) => {
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
        console.log(shapeIdMap.get(key))
        shapeIdMap.get(key).push(pair)
        console.log(shapeIdMap.get(key))
      }
    }
  })
  for (let i = 0; i < stopsData.length; i++) {
    const stop = stopsData[i]
    const key = `${stop.stop_lat}:${stop.stop_lon}`
    if (shapeIdMap.has(key)) {
      stop.routes = shapeIdMap.get(key)
    }
  }*/
  console.log('teqsdjfbzshfgbzjhbz', stopsData, routesMap)
  return stopsData
}
