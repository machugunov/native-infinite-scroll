import {eachDayOfInterval, interval, startOfDay, addDays} from 'date-fns'
import {formatDateToIso} from './formatDateToIso'

export const getPrevDays = (date: string, count: number = 1): string[] => {
  if(count < 1) {
    return [];
  }

  const startDate = startOfDay(addDays(date, -1))
  const endDate = startOfDay(addDays(date, -count))

  return eachDayOfInterval(interval(startDate, endDate)).map(formatDateToIso).reverse()
}