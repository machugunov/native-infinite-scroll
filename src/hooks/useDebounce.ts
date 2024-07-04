import {useMemo} from 'react'

type UseDebounce = (callback: () => void) => void

export const useDebounce = (delay: number = 0): UseDebounce => {
  return useMemo(() => {
    let timer: ReturnType<typeof setTimeout>;

    return (callback: () => void) => {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(callback, delay)
    }
  }, [delay])
}