import {isBefore} from 'date-fns'

import {FulldayEvent} from '../api/methods/getFulldayEvents'

export const sortFulldayEvents = (left: FulldayEvent, right: FulldayEvent) => {
  return isBefore(left.start, right.start) ? -1 : 1
}