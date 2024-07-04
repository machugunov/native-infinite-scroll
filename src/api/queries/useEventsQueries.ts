import {useQueries, UseQueryOptions, keepPreviousData} from '@tanstack/react-query'
import {getEvents, Event} from '../methods/getEvents'

type UseEventsQueryProps = {
  intervals: Array<{
    start: string;
    end: string;
  }>
}

export const useEventsQueries = ({intervals}: UseEventsQueryProps) => {
  return useQueries({ 
    queries: intervals.map<UseQueryOptions<Event[]>>(({start, end}) => ({
      queryKey: ['events', start, end],
      queryFn: () => getEvents({start, end}),
      placeholderData: keepPreviousData,
      staleTime: Infinity
    })),
    combine: (results) => ({
      data: results.reduce<Event[]>((total, {data = []}) => {
        return [...total, ...data]
      }, []),
    })
  })
}