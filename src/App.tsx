
import './App.css'

import {startOfDay} from 'date-fns'

import {Calendar} from './components/Calendar'
import {Providers} from './components/Providers'

import {formatDateToIso} from './helpers/formatDateToIso.ts'

export const App = () => {
  const date = formatDateToIso(startOfDay(new Date()))
  const maxColumnCount = 7
  const minColumnWidth = 200
  const overscanColumns = 100

  return (
    <Providers>
      <div className='app' id="app">
        <div className='gridContainer'>
          <Calendar
            date={date}
            maxColumnCount={maxColumnCount}
            minColumnWidth={minColumnWidth}
            overscanColumns={overscanColumns}
          />
        </div>
      </div>
    </Providers>
  )
}