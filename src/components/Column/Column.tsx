import { ReactNode } from 'react';
import './style.css'

type ColumnProps = {
  title: string;
  fulldayEvents?: ReactNode;
  events?: ReactNode;
}

export const Column = ({title, fulldayEvents, events}: ColumnProps) => {
  return (
    <div className='column'>
      <div className="header">{title}</div>
      <div className="fulldayEventsContainer">{fulldayEvents}</div>
      <div className="eventsContainer">{events}</div>
    </div>
  )
}