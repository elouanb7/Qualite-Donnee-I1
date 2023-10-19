import axios from 'axios'
import { fromLonLat } from 'ol/proj'

export async function parseStops() {
  return axios
    .get('src/data/stops.json')
    .then((response) => {
      let jsonData = response.data
      jsonData = jsonData.filter((element) => element.stop_id.length === 4)
      return jsonData.map((stop) => ({
        coordinates: fromLonLat([stop.stop_lon, stop.stop_lat]),
        name: stop.stop_name,
        id: stop.stop_id,
        wheelchair: stop.wheelchair_boarding
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
