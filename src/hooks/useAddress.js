import { useQuery } from 'react-query'
import axios from 'axios'

const generateToken = () => (Math.random() + 1).toString(36).substring(2)

let sessiontoken = generateToken()

console.log('sessiontoken', sessiontoken)
export function useSuggestions(search, focus) {
  return useQuery(
    ['search', search],
    () =>
      search && search.length > 2
        ? axios
            .get(
              `https://photon--ecolab-transport.netlify.app/.netlify/functions/callGMapSearch?${search}`
            )
            .then((res) => res.data.features)
        : Promise.resolve([]),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      enabled: focus,
    }
  )
}
export function useAddress(id) {
  return useQuery(
    ['address', id],
    () =>
      axios
        .get(
          `https://photon--ecolab-transport.netlify.app/.netlify/functions/callGMapPlace?place_id=${id}&sessiontoken=${sessiontoken}`
        )
        .then((res) => {
          sessiontoken = generateToken()
          return res.data
        }),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      enabled: id ? true : false,
    }
  )
}
export function usePosition(position) {
  return useQuery(
    ['position', position?.timestamp],
    () =>
      axios
        .get(
          `https://api-adresse.data.gouv.fr/reverse/?lon=${position.coords.longitude}&lat=${position.coords.latitude}`
        )
        .then((res) => res.data),
    {
      enabled: position ? true : false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  )
}
