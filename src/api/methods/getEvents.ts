import {eachDayOfInterval, interval} from 'date-fns'
import {formatDateToIso} from '../../helpers/formatDateToIso'
import {EVENTS} from './events'

export type Event = {
  id: number;
  title: string;
  date: string;
}

type GetEventsProps = {
  start: string;
  end: string;
}

export const getEvents = async ({start, end}: GetEventsProps): Promise<Event[]> => {
  // console.log(`fetch events: ${start} - ${end}`);

  const response: Event[] = []

  eachDayOfInterval(interval(start, end)).forEach(date => {
    const dateIso = formatDateToIso(date);
    response.push(...EVENTS.filter(event => event.date === dateIso))
  })

  await new Promise(resolve => setTimeout(resolve, 1000))

  return response;
}