import {useQuery, UseQueryResult,keepPreviousData} from '@tanstack/react-query'
import {getFulldayEvents, FulldayEvent} from '../methods/getFulldayEvents'

type UseEventsQueryProps = {
  start: string;
  end: string;
}

export const useFulldayEventsQuery = ({start,end}: UseEventsQueryProps): UseQueryResult<FulldayEvent[]> => {
  return useQuery({
    queryKey: ['fullday-events', start, end],
    queryFn: () => getFulldayEvents({start, end}),
    placeholderData: keepPreviousData,
  })
}