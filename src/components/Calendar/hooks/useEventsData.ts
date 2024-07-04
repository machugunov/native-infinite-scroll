import { useMemo } from 'react'
import {eachDayOfInterval, interval, isBefore, isAfter} from 'date-fns'

import {useFulldayEventsQueries} from '../../../api/queries/useFulldayEventsQueries'
import {useEventsQueries} from '../../../api/queries/useEventsQueries.ts'
import {Event} from '../../../api/methods/getEvents.ts'
import {FulldayEvent} from '../../../api/methods/getFulldayEvents'

import {formatIsoToDate} from '../../../helpers/formatIsoToDate'
import {formatDateToIso} from '../../../helpers/formatDateToIso'

export type AdaptedFulldayEvent = {
  fulldayEvent: FulldayEvent;
  adaptedStart: string;
  adaptedEnd: string;
  adaptiveLength: number;
}

export type FulldayEventsGrid = {
  [date: string]: Array<number | null> // id события | спейсер>
}

type UseEventsDataProps = {
  intervals: Array<{
    start: string;
    end: string;
  }>;
  gridDatesArray: string[];
  visibleStartIndex: number;
  visibleEndIndex: number;
}

type UseEventsData = {
  events: Event[];
  adaptedFulldayEvents: AdaptedFulldayEvent[];
  fulldayEventsGrid: FulldayEventsGrid;
}

const INITIAL_EVENTS_DATA: Event[] = [];
const INITIAL_FULLDAY_EVENTS_DATA: FulldayEvent[] = [];

export const useEventsData = ({intervals, gridDatesArray, visibleStartIndex, visibleEndIndex}: UseEventsDataProps): UseEventsData => {
  const {data: events = INITIAL_EVENTS_DATA} = useEventsQueries({ intervals })
  const {data: fulldayEvents = INITIAL_FULLDAY_EVENTS_DATA} = useFulldayEventsQueries({ intervals })

  const extendedStartDate = (() => {
    for (let i = 2; i >= 0; i--) {
      const newStartDate = gridDatesArray[visibleStartIndex - i]

      if (newStartDate) {
        return newStartDate
      }
    }

    return gridDatesArray[visibleStartIndex]
  })()

  const extendedEndDate = (() => {
    for (let i = 2; i >= 0; i--) {
      const newEndDate = gridDatesArray[visibleEndIndex + i]
      
      if (newEndDate) {
        return newEndDate
      }
    }

    return gridDatesArray[visibleEndIndex]
  })()  
  
  const extendedVisibleSection = eachDayOfInterval(
    interval(formatIsoToDate(extendedStartDate), formatIsoToDate(extendedEndDate))
  ).map(formatDateToIso)

  const filteredEvents = useMemo(() => {
    return events.filter(({date}) => extendedVisibleSection.includes(date))
  }, [events, extendedVisibleSection])

  const adaptedFulldayEvents = useMemo(() => {
    const onlyVisibleFulldayEvents = fulldayEvents.filter(fulldayEvent => {
      const fulldayEventSection = eachDayOfInterval(interval(formatIsoToDate(fulldayEvent.start), formatIsoToDate(fulldayEvent.end))).map(formatDateToIso)      
      
      const visibleSectionIncludesFulldayEvent = extendedVisibleSection.includes(fulldayEvent.start) || extendedVisibleSection.includes(fulldayEvent.end);
      const fulldayEventSectionIncludesVisibleSection = fulldayEventSection.includes(extendedStartDate) || fulldayEventSection.includes(extendedEndDate);

      return visibleSectionIncludesFulldayEvent || fulldayEventSectionIncludesVisibleSection;
    })    

    const adaptedFulldayEvents = onlyVisibleFulldayEvents.map(fulldayEvent => {
      const adaptedFuldayEvent: AdaptedFulldayEvent = {
        fulldayEvent,
        adaptedStart: fulldayEvent.start,
        adaptedEnd: fulldayEvent.end,
        adaptiveLength: 1,
      }

      if (isBefore(adaptedFuldayEvent.adaptedStart, extendedStartDate)) {
        adaptedFuldayEvent.adaptedStart = extendedStartDate
      }
      
      if (isAfter(adaptedFuldayEvent.adaptedEnd, extendedEndDate)) {
        adaptedFuldayEvent.adaptedEnd = extendedEndDate
      }

      adaptedFuldayEvent.adaptiveLength = eachDayOfInterval(interval(adaptedFuldayEvent.adaptedStart, adaptedFuldayEvent.adaptedEnd)).length
      
      return adaptedFuldayEvent
    })
    
    return adaptedFulldayEvents
  }, [fulldayEvents, extendedVisibleSection, extendedStartDate, extendedEndDate])

  const maxFulldayEventsOnColumn = useMemo(() => {
    if (!adaptedFulldayEvents.length) {
      return 0;
    }

    const maxFulldayEventsOnDayMap: { 
      [date: string]: number
    } = {}

    adaptedFulldayEvents.forEach(({adaptedStart, adaptedEnd}) => {
      const fulldayEventSection = eachDayOfInterval(interval(formatIsoToDate(adaptedStart), formatIsoToDate(adaptedEnd)))      

      fulldayEventSection.forEach(date => {
        const isoDate = formatDateToIso(date);

        if (!maxFulldayEventsOnDayMap[isoDate]) {
          maxFulldayEventsOnDayMap[isoDate] = 0
        }

        maxFulldayEventsOnDayMap[isoDate]++;
      })
    })    

    const maxFulldayEventsOnColumn = Object.values(maxFulldayEventsOnDayMap).reduce((maxValue, current) => {
      if(current > maxValue) {
        return current;
      }
      return maxValue
    }, 0)

    return maxFulldayEventsOnColumn;
  }, [adaptedFulldayEvents])

  const fulldayEventsGrid = useMemo(() => {
    const grid: FulldayEventsGrid = {}

    extendedVisibleSection.forEach(date => {
      grid[date] = new Array(maxFulldayEventsOnColumn).fill(undefined)
    })    

    adaptedFulldayEvents.forEach(({adaptedStart, adaptedEnd}, eventIndex) => {
      const fulldayEventSection = eachDayOfInterval(interval(formatIsoToDate(adaptedStart), formatIsoToDate(adaptedEnd))).map(formatDateToIso)
      
      let eventRowIndex: number | undefined = undefined;
      let isAdded = false

      fulldayEventSection.forEach(eventDate => {
        const column = grid[eventDate]

        for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
          const cellState = grid[eventDate][rowIndex]          

          if (cellState !== undefined) {
            continue;
          }

          if(isAdded && eventRowIndex !== undefined) {
            grid[eventDate][eventRowIndex] = null
            break;
          }

          grid[eventDate][rowIndex] = eventIndex
          isAdded = true;
          eventRowIndex = rowIndex;
          break;
        }
      })
    })

    for (const columnIndex in grid) {
      grid[columnIndex].forEach((state, rowIndex) => {
        if(state === undefined) {
          grid[columnIndex][rowIndex] = null
        }
      })
    }

    return grid
  }, [adaptedFulldayEvents, maxFulldayEventsOnColumn, extendedVisibleSection])
  
  return {
    events: filteredEvents,
    adaptedFulldayEvents,
    fulldayEventsGrid
  }
}