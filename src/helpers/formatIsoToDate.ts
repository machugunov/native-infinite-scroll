import {addHours} from 'date-fns'

export const formatIsoToDate = (isoDate: string): Date => {
  return addHours(new Date(isoDate), -3)
}