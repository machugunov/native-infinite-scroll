import {CSSProperties, useMemo} from 'react'
import './style.css'

type FulldayEventCardProps = {
  children: string;
  length?: number;
}

export const FulldayEventCard = ({children, length = 1}: FulldayEventCardProps) => {
  const style = useMemo(() => {
    const style: CSSProperties = {
      width: `calc(${100 * length}% + ${10 * (length * 2 - 2)}px`
    }

    return style
  }, [length])

  return (
    <div className="fulldayEventCardContainer">
      <div
        className="fulldayEventCard"
        style={style}
        onClick={() => alert(children)}
      >
        <div className='fulldayEventCardContent'>{children}</div>
      </div>
    </div>
  )
}

export const FulldayEventSpacer = () => {
  return <div className='fulldayEventSpacer' />
}