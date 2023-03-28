import { onUnmounted } from 'vue'
export function useEventListener(
  target: any,
  event: keyof WindowEventMap,
  callback: (...arg: any[]) => void,
  isCapture: boolean = false
) {
  if (!target) return
  const fn = (...arg: any[]) => {
    callback.apply(target, arg)
  }
  target.addEventListener(event, fn, isCapture)
  onUnmounted(() => {
    target.removeEventListener(event, fn, isCapture)
  })
}
