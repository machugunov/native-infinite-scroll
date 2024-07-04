import {useQueries, UseQueryOptions, keepPreviousData} from '@tanstack/react-query'
import {getFulldayEvents, FulldayEvent} from '../methods/getFulldayEvents'
import {sortFulldayEvents} from '../../helpers/sortFulldayEvents'

type UseFulldayEventsQueriesProps = {
  intervals: Array<{
    start: string;
    end: string;
  }>
}

export const useFulldayEventsQueries = ({intervals}: UseFulldayEventsQueriesProps) => {
  return useQueries({ 
    queries: intervals.map<UseQueryOptions<FulldayEvent[]>>(({start, end}) => ({
      queryKey: ['fullday-events', start, end],
      queryFn: () => getFulldayEvents({start, end}),
      placeholderData: keepPreviousData,
      staleTime: Infinity,
    })),
    combine: (results) => {
      const fulldayEventsMap: { [id: number]: FulldayEvent } = {}

      results.forEach(({data = []}) => {
        data?.forEach(fulldayEvent => {
          if (fulldayEventsMap[fulldayEvent.id]) {
            return;
          }

          fulldayEventsMap[fulldayEvent.id] = fulldayEvent
        })
      })

      return {
        data: Object.values(fulldayEventsMap).sort(sortFulldayEvents)
      }
    }
  })
}