import {useState, useMemo, useRef, useLayoutEffect} from 'react'
import {startOfWeek} from 'date-fns'

import {getPrevDays} from '../../../helpers/getPrevDays.ts'
import {getNextDays} from '../../../helpers/getNextDays.ts'
import {formatIsoToDate} from '../../../helpers/formatIsoToDate'
import {formatDateToIso} from '../../../helpers/formatDateToIso'

import {EVENTS_INTERVAL_LENGTH} from '../constants'

type UseDateIntervalsProps = {
  date: string;
  overscanColumns: number
}

type UseDateIntervals = {
  gridDatesArray: string[];
  intervals: Array<{
    start: string;
    end: string;
  }>;

  setFocusedDate: (newFocusedDate: string) => void;
  setNewGridDatesArray: (index: number, resetGridScrollCallback: () => void) => void;
}

export const useDateIntervals = ({date, overscanColumns}: UseDateIntervalsProps): UseDateIntervals => {
  const resetGridScrollCallbackRef = useRef<(() => void) | null>(null)

  const [pivotDate, setPivotDate] = useState<string>(date)
  const [focusedDate, setFocusedDate] = useState<string>(date)

  const intervals = useMemo(() => {
    const startOfFocusedWeek = formatDateToIso(
      startOfWeek(formatIsoToDate(focusedDate), {weekStartsOn: 1})
    )    

    // предыдущий недельный интервал
    const prevWeek = getPrevDays(startOfFocusedWeek, EVENTS_INTERVAL_LENGTH) 
    // видимый недельный интервал
    const thisWeek = [startOfFocusedWeek, ...getNextDays(startOfFocusedWeek, EVENTS_INTERVAL_LENGTH - 1)]
    // следйющий недельный интервал
    const nextWeek = getNextDays(thisWeek[thisWeek.length - 1], EVENTS_INTERVAL_LENGTH)
  
    const intervals = [
      {
        start: prevWeek[0],
        end: prevWeek[prevWeek.length - 1]
      },
      {
        start: thisWeek[0],
        end: thisWeek[thisWeek.length - 1]
      },
      {
        start: nextWeek[0],
        end: nextWeek[nextWeek.length - 1]
      },
    ];

    return intervals
  }, [focusedDate])

  const gridDatesArray = useMemo(() => {
    const prevGridDatesArray = getPrevDays(pivotDate, overscanColumns)
    const nextGridDatesArray = getNextDays(pivotDate, overscanColumns)
    
    return [...prevGridDatesArray, pivotDate, ...nextGridDatesArray];
  }, [pivotDate, overscanColumns])

  const setNewGridDatesArray = (index: number, resetGridScrollCallback: () => void) => {
    const date = gridDatesArray[index]
    
    resetGridScrollCallbackRef.current = resetGridScrollCallback
    setPivotDate(date)
  }

  useLayoutEffect(() => {
    resetGridScrollCallbackRef.current?.()
    resetGridScrollCallbackRef.current = null
  }, [pivotDate])

  return {
    gridDatesArray,
    intervals,

    setFocusedDate,
    setNewGridDatesArray
  }
}

