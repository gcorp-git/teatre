/**
 * Unlike the browser, this class will not allow you to assign the same handler
 * to the same event of the same node twice, even if their options are different
 */
export class DOMListener {
  private storage = new Map<any, {[event: string]: Map<(e: any) => void, any>}>()

  on($node: any, event: string, listener: (e: any) => void, options?: any): void {
    if (!this.storage.has($node)) this.storage.set($node, {})

    let listeners = this.storage.get($node)[event]

    if (!listeners) {
      listeners = new Map()
      this.storage.get($node)[event] = listeners
    }

    listeners.set(listener, options)

    $node.addEventListener(event, listener, options)
  }

  off($node: any, event: string, listener: (e: any) => void, options?: any): void {
    if (!this.storage.has($node)) return

    const listeners = this.storage.get($node)[event]

    if (!listeners) return
    if (!listeners.has(listener)) return

    listeners.delete(listener)

    $node.removeEventListener(event, listener, options)
  }

  emit($node: any, event: string, e?: any) {
    const events = this.storage.get($node)

    if (!events) return

    const listeners = events[event]

    if (!listeners) return

    for (const [listener, options] of listeners) {
      listener(e)
    }
  }

  clear($node?: any, event?: string): void {
    if ($node && event) {
      const events = this.storage.get($node)

      if (!events) return

      const listeners = events[event]

      if (!listeners) return

      for (const [listener, options] of listeners) {
        $node.removeEventListener(event, listener, options)
      }

      listeners.clear()
    } else {
      for (const [$node, events] of this.storage) {
        for (const event in events) {
          for (const [listener, options] of events[event]) {
            $node.removeEventListener(event, listener, options)
          }
        }
      }

      this.storage.clear()
    }
  }
}
