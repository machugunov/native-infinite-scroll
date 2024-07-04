import {addHours} from 'date-fns'

export const formatDateToIso = (date: Date): string => {
  return addHours(date, 3).toISOString();
}