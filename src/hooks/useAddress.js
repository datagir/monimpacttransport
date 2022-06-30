import { useQuery } from 'react-query'
import axios from 'axios'

export function useSuggestions(search, focus) {
  return useQuery(
    ['search', search],
    () =>
      search && search.length > 2
        ? axios
            .get(
              `https://monimpacttransport.fr/.netlify/functions/callGMapSearch?input=${search}&language=fr`
            )
            .then((res) => res.data.predictions)
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
          `https://monimpacttransport.fr/.netlify/functions/callGMapPlace?place_id=${id}`
        )
        .then((res) => res.data),
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
