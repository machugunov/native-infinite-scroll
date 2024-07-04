import {eachDayOfInterval, interval} from 'date-fns'
import {formatDateToIso} from '../../helpers/formatDateToIso'
import {formatIsoToDate} from '../../helpers/formatIsoToDate'
import {FULLDAY_EVENTS} from './fulldayEvents'

export type FulldayEvent = {
  id: number;
  title: string;
  start: string;
  end: string;
}

type GetFulldayEventsProps = {
  start: string;
  end: string;
}

export const getFulldayEvents = async ({start, end}: GetFulldayEventsProps): Promise<FulldayEvent[]> => {
  // console.log(`fetch fulldayEvents: ${start} - ${end}`);

  const response: FulldayEvent[] = []

  eachDayOfInterval(interval(start, end)).forEach(date => {
    const dateIso = formatDateToIso(date);

    response.push(...FULLDAY_EVENTS.filter(event => {
      const intervalDates = eachDayOfInterval(interval(formatIsoToDate(event.start), formatIsoToDate(event.end))).map(formatDateToIso)
      return intervalDates.includes(dateIso) || intervalDates.includes(dateIso)
    }))
  })

  await new Promise(resolve => setTimeout(resolve, 1000))

  return response;
}