import {useEffect} from 'react'

import {Column} from '../Column/index.ts'
import {EventCard} from '../EventCard/index.ts'
import {FulldayEventCard, FulldayEventSpacer} from '../FulldayEventCard/index.ts'
import {Scroll, useScrollApi} from '../Scroll'

import {useDateIntervals} from './hooks/useDateIntervals.ts'
import {useEventsData} from './hooks/useEventsData.ts'

import {useDebounce} from '../../hooks/useDebounce.ts'

import {formatIsoToDate} from '../../helpers/formatIsoToDate.ts'

type CalendarProps = {
  date: string;
  minColumnWidth: number;
  maxColumnCount: number;
  overscanColumns: number;
}

export const Calendar = ({date, minColumnWidth, maxColumnCount, overscanColumns}: CalendarProps) => {
  const debounce = useDebounce(300)

  const overscan = overscanColumns < maxColumnCount ? maxColumnCount : overscanColumns;

  const {
    gridDatesArray,
    intervals,
    setNewGridDatesArray,
    setFocusedDate
  } = useDateIntervals({date, overscanColumns: overscan})

  const {
    visibleStartIndex,
    visibleEndIndex,
    scrollProps
  } = useScrollApi({
    minColumnWidth,
    maxColumnCount,
    onScrollEnd: setNewGridDatesArray,
    overscanColumns: overscan
  })

  useEffect(() => {
    debounce(() => {
      const newFocusedDate = gridDatesArray[visibleStartIndex]
      setFocusedDate(newFocusedDate)
    })
  }, [visibleStartIndex])
  
  const {
    events, 
    adaptedFulldayEvents, 
    fulldayEventsGrid
  } = useEventsData({intervals, gridDatesArray, visibleStartIndex, visibleEndIndex})
  
  return (
    <Scroll {...scrollProps}>
      {gridDatesArray.map((columnDate) => {
        const eventsComponent = events.filter(({date}) => date === columnDate).map(({id, title}) => (
          <EventCard key={id}>{title}</EventCard>
        ))        

        const fulldayEventsComponent = fulldayEventsGrid[columnDate]?.map((state, index) => {
          if (state === null) {
            return <FulldayEventSpacer key={`spacer-${index}`} />
          }

          const {adaptiveLength, fulldayEvent } = adaptedFulldayEvents[state]              

          return (
            <FulldayEventCard
              key={fulldayEvent.id}
              length={adaptiveLength}
            >
                {fulldayEvent.title}
            </FulldayEventCard>
          )
        })

        return (
          <Column
            key={columnDate}
            title={formatIsoToDate(columnDate).toLocaleDateString()}
            fulldayEvents={fulldayEventsComponent}
            events={eventsComponent}
          />
        )
        })}
    </Scroll>  
  )
}