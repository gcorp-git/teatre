import { Service } from '../decorators/service.decorator'
import { Subscriptions } from '../../utils/subscriptions'

@Service({
  static: true,
})
export class EventsService {
  private subs: Subscriptions

  constructor() {
    this.subs = new Subscriptions()
  }

  on(event: string, listener: (...args: any) => void): void {
		this.subs.on(event, listener)
  }

  off(event: string, listener: (...args: any) => void): void {
    this.subs.off(event, listener)
  }

  emit(event: string, ...args: any): void {
    this.subs.emit(event, ...args)
  }

  clear(event?: string): void {
    this.subs.clear(event)
  }
}
