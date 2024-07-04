import './style.css'

import { ReactNode, CSSProperties, forwardRef, UIEventHandler} from "react"

type ScrollProps = {
  children: ReactNode[];
  columnsCount: number;
  minColumnWidth: number;
  onScroll?: UIEventHandler;
}

export const Scroll = forwardRef<HTMLDivElement, ScrollProps>(({
  children,
  columnsCount,
  minColumnWidth,
  onScroll,
}, ref) => {
  const style: CSSProperties = {
    width: `${100 / columnsCount}%`,
    minWidth: `${minColumnWidth}px`
  }

  return (
    <div
      ref={ref}
      className="scrollContainer"
      onScroll={onScroll}
    >
      {children.map((item, index) => (
        <div key={index} id={(index).toString()} className='columnContainer' style={style}>
          {item}
        </div>
      ))}
    </div>
  )
})