import {useRef, RefObject, useLayoutEffect, useState, UIEventHandler} from 'react'
import {ScrollController} from '../ScrollController'

type UseScrollApiProps = {
  minColumnWidth: number;
  maxColumnCount: number;
  overscanColumns: number;
  onScrollEnd: (index: number, resetScrollPosition: () => void) => void;
}

type ScrollProps = {
  ref: RefObject<HTMLDivElement>
  minColumnWidth: number;
  columnsCount: number;
  onScroll?: UIEventHandler;
}

type UseScrollApi = {
  visibleStartIndex: number;
  visibleEndIndex: number;
  scrollProps: ScrollProps
}

export const useScrollApi = ({
  minColumnWidth,
  maxColumnCount,
  overscanColumns,
  onScrollEnd
}: UseScrollApiProps): UseScrollApi => {
  const ref = useRef<HTMLDivElement>(null)

  const [visibleStartIndex, setVisibleStartIndex] = useState<number>(0)
  const [visibleEndIndex, setVisibleEndIndex] = useState<number>(0)
  const [columnsCount, setColumnsCount] = useState<number>(maxColumnCount)

  const [scrollControllerInstance, setScrollControllerInstance] = useState<ScrollController | null>(null);

  useLayoutEffect(() => {    
    scrollControllerInstance?.update({
      minColumnWidth,
      maxColumnCount,
      overscanColumns,
      onScrollEnd,
      setVisibleStartIndex,
      setVisibleEndIndex,
      setColumnsCount,
    })
  }, [
    minColumnWidth,
    maxColumnCount,
    overscanColumns,
    onScrollEnd,
    setColumnsCount,
    setVisibleStartIndex,
    setVisibleEndIndex,
  ])

  useLayoutEffect(() => {    
    const app = document.getElementById('app')

    if(!ref.current || !app) {
      return
    }

    const newScrollControllerInstance = new ScrollController({
      scrollableElement: ref.current,
      verticalScrollableElement: app,
      minColumnWidth,
      maxColumnCount,
      overscanColumns,
      onScrollEnd,
      setColumnsCount,
      setVisibleStartIndex,
      setVisibleEndIndex,
    })

    setScrollControllerInstance(newScrollControllerInstance)

    return () => {
      newScrollControllerInstance.destroy()
    }
  }, [])  
    
  return {
    visibleStartIndex,
    visibleEndIndex,

    scrollProps: {
      ref,
      columnsCount,
      minColumnWidth,
      onScroll: scrollControllerInstance?.onScroll,
    }
  }
}