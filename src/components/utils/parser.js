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
        id: stop.stop_id
      }))
    })
    .catch((error) => {
      console.error('Error fetching JSON data:', error)
      return []
    })
}
