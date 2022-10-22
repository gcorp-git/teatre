export const ERROR = {
  INCORRECT_EVENT_NAME: 'INCORRECT_EVENT_NAME',
}

export class Subscriptions<T extends (...args: any) => void = (...args: any) => void> {
  private map: { [event: string]: Set<T> } = {}

  get names(): string[] {
    return Object.keys(this.map)
  }

  on(event: string, listener: T): void {
    if (!event) throw ERROR.INCORRECT_EVENT_NAME
    if (!this.map[event]) this.map[event] = new Set<T>()

    this.map[event].add(listener)
  }

  off(event: string, listener: T): void {
    if (!event) throw ERROR.INCORRECT_EVENT_NAME
    if (!this.map[event]) return

    this.map[event].delete(listener)

    if (!this.map[event].size) delete this.map[event]
  }

  clear(event?: string): void {
    if (event) {
      delete this.map[event]
    } else {
      if (event === '') throw ERROR.INCORRECT_EVENT_NAME

      this.map = {}
    }
  }

  emit(event: string, ...args: any): void {
    if (!event) throw ERROR.INCORRECT_EVENT_NAME
    if (!this.map[event]) return

    for (const listener of this.map[event]) {
      listener(...args)
    }
  }

  each(event: string, f: (subscriber: T) => void): void {
    if (!event) throw ERROR.INCORRECT_EVENT_NAME
    if (!this.map[event]) return
    
    for (const subscriber of this.map[event]) {
      f(subscriber)
    }
  }
}
