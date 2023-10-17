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

export async function parseStopTimes() {
  return axios
    .get('src/data/stop_times.json')
    .then((response) => {
      let jsonData = response.data
      console.log('first :', jsonData[0])
    })
    .catch((error) => {
      console.error('Error fetching JSON data:', error)
      return []
    })
}
