import {useQuery, UseQueryResult,keepPreviousData} from '@tanstack/react-query'
import {getEvents, Event} from '../methods/getEvents'

type UseEventsQueryProps = {
  start: string;
  end: string;
}

export const useEventsQuery = ({start,end}: UseEventsQueryProps): UseQueryResult<Event[]> => {
  return useQuery({
    queryKey: ['events', start, end],
    queryFn: () => getEvents({start, end}),
    placeholderData: keepPreviousData,
  })
}