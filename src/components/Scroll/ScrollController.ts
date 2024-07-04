type ScrollControllerConstructorProps = {
  scrollableElement: HTMLDivElement;
  verticalScrollableElement?: HTMLElement;
  minColumnWidth: number;
  maxColumnCount: number;
  overscanColumns: number;
  onScrollEnd: (index: number, resetScrollPosition: () => void) => void;
  setVisibleStartIndex: (visibleStartIndex: number) => void;
  setVisibleEndIndex: (visibleEndIndex: number) => void;
  setColumnsCount: (newColumnsCount: number) => void;
}

type ScrollControllerUpdateProps = {
  minColumnWidth: number;
  maxColumnCount: number;
  overscanColumns: number;
  onScrollEnd: (index: number, resetScrollPosition: () => void) => void;
  setColumnsCount: (newColumnsCount: number) => void;
  setVisibleStartIndex: (visibleStartIndex: number) => void;
  setVisibleEndIndex: (visibleEndIndex: number) => void;
}

const MATH_THRESHOLD = 0.95

const getDebounce = (delay: number) => {
  let timeout: number;

  return (callback: () => void) => {
    clearTimeout(timeout)
    timeout = setTimeout(callback, delay)
  }
}

export class ScrollController {
  private visibleStartIndex: number = 0;
  private initialVisibleStartIndex: number = 0;

  private setColumnsCount: (newColumnsCount: number) => void;
  private setVisibleStartIndex: (visibleStartIndex: number) => void;
  private setVisibleEndIndex: (visibleEndIndex: number) => void;

  private resetScrollDebounce: (callback: () => void) => void = getDebounce(100)

  private onScrollEnd: (index: number, resetScrollPosition: () => void) => void;

  private columnsCount: number = 0;
  private columnWidth: number = 0;
  private overscanColumns: number = 0;
  private minColumnWidth: number = 0;
  private maxColumnCount: number = 0;
  private criticalLeftIndex: number = 0;
  private criticalRightIndex: number = 0;

  private scrollableElement: HTMLDivElement;

  private isInitedResizeObserver: boolean = false;

  private resizeObserver: ResizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0]

    if(!entry) {
      return;
    }

    const { contentRect: { width } } = entry

    if (!this.isInitedResizeObserver) {
      this.isInitedResizeObserver = true
      return;
    }

    this.onResize(width)
  })

  constructor({
    scrollableElement,
    minColumnWidth,
    maxColumnCount,
    overscanColumns,
    onScrollEnd,
    setVisibleStartIndex,
    setVisibleEndIndex,
    setColumnsCount,
  }: ScrollControllerConstructorProps) {
    this.scrollableElement = scrollableElement
    this.minColumnWidth = minColumnWidth
    this.maxColumnCount = maxColumnCount
    this.overscanColumns = overscanColumns

    this.onScrollEnd = onScrollEnd
    this.setColumnsCount = setColumnsCount
    this.setVisibleStartIndex = setVisibleStartIndex
    this.setVisibleEndIndex = setVisibleEndIndex

    this.init()
  }

  /* */

  private init = () => {
    this.initialVisibleStartIndex = this.overscanColumns

    this.criticalLeftIndex = Math.ceil(this.overscanColumns * (3 / 4))
    this.criticalRightIndex = Math.ceil(this.overscanColumns + this.overscanColumns * (1 / 4))

    this.setCurrrentColumnsCount()
    this.setColumnWidth() 
    
    this.setNewVisibleIndexes(this.initialVisibleStartIndex)
    this.scrollToColumn(this.initialVisibleStartIndex)
  }

  public destroy = () => {
    this.resizeObserver.unobserve(this.scrollableElement)
  }

  public update = ({
    minColumnWidth,
    maxColumnCount,
    overscanColumns,
    onScrollEnd,
    setColumnsCount,
    setVisibleEndIndex,
    setVisibleStartIndex
  }: ScrollControllerUpdateProps) => {
    this.onScrollEnd = onScrollEnd
    this.setColumnsCount = setColumnsCount
    this.setVisibleStartIndex = setVisibleStartIndex
    this.setVisibleEndIndex = setVisibleEndIndex

    this.minColumnWidth = minColumnWidth
    this.maxColumnCount = maxColumnCount
    this.overscanColumns = overscanColumns

    this.initialVisibleStartIndex = this.overscanColumns

    this.setCurrrentColumnsCount()
    this.setColumnWidth()
  }

  /* */

  private onResize = (newClientWidth: number) => {
    this.setCurrrentColumnsCount()
    this.setColumnWidth(newClientWidth)
    console.log({ count: this.columnsCount, width: this.columnWidth});   

    const currentStartVisibleIndex = this.getCurrentStartVisibleIndex();
    this.setNewVisibleIndexes(currentStartVisibleIndex)   
  }

  /* */

  private setCurrrentColumnsCount = () => {
    const currentColumnWidth = this.scrollableElement.clientWidth / this.maxColumnCount
    
    if (currentColumnWidth >= this.minColumnWidth ) {
      this.columnsCount = this.maxColumnCount;
    } else {
      this.columnsCount = Math.ceil(this.scrollableElement.clientWidth / this.minColumnWidth)    
    }
    
    this.setColumnsCount(this.columnsCount)
  }

  private setColumnWidth = (newClientWidth?: number) => {
    const clientWidth = newClientWidth || this.scrollableElement.clientWidth;
    const newColumnWidth = clientWidth / this.columnsCount
    this.columnWidth = newColumnWidth < this.minColumnWidth ? this.minColumnWidth : newColumnWidth;
  }

  /* */

  private setNewVisibleIndexes = (newVisibleStartIndex: number) => {    
    if(this.visibleStartIndex === newVisibleStartIndex) {
      return
    }

    const newVisibleEndIndex = this.columnsCount > 1 
      ? newVisibleStartIndex + this.columnsCount - 1
      : newVisibleStartIndex

    this.visibleStartIndex = newVisibleStartIndex;

    this.setVisibleStartIndex(newVisibleStartIndex)
    this.setVisibleEndIndex(newVisibleEndIndex)
  }

  private getCurrentStartVisibleIndex = () => {
    const currentScrollLeft = this.scrollableElement.scrollLeft  / this.columnWidth
    const roundedCurrentScrollLeft = Math.floor(currentScrollLeft)    

    if (currentScrollLeft % roundedCurrentScrollLeft > MATH_THRESHOLD) {
      return roundedCurrentScrollLeft + 1
    }
    
    return roundedCurrentScrollLeft
  }

  /* */

  private scrollToColumn = (columnIndex: number) => {
    const newScrollLeft = this.columnWidth * columnIndex
    this.scrollableElement.scroll({left: newScrollLeft})
  }

  /* */

  public onScroll = () => {    
    const currentStartVisibleIndex = this.getCurrentStartVisibleIndex();
    this.setNewVisibleIndexes(currentStartVisibleIndex)
    
    if (currentStartVisibleIndex <= this.criticalLeftIndex || currentStartVisibleIndex >= this.criticalRightIndex) {
      this.resetScrollDebounce(() => {            
        console.log(currentStartVisibleIndex);
        this.onScrollEnd(currentStartVisibleIndex, () => {          
          this.scrollToColumn(this.initialVisibleStartIndex)
        })
      })
    }
  }
}
