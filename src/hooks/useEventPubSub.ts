import mitt from 'mitt'

type Events = {
  focusOptions: any
}
const emitter = mitt<Events>()
export function useEventPubSub() {
  return {
    emit: emitter.emit,
    on: emitter.on,
    off: emitter.off
  }
}
