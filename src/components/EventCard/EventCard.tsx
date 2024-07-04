import './style.css'

type EventCardProps = {
  children: string;
}

export const EventCard = ({children}: EventCardProps) => {
  return (
    <div className="eventCard" onClick={() => alert(children)}>{children}</div>
  )
}