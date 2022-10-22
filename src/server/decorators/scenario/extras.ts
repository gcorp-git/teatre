import { ScenarioClass } from '../scenario.class';
import { InjectorService } from '../../services/injector.service';
import { IActor, IActorClass } from '../actor.model';

export class Extras<T extends IActor> {
  private set = new Set<T>()

  constructor(
    private scenario: ScenarioClass,
    private injector: InjectorService,
    private ExtraClass: IActorClass,
  ) {
    //
  }

  get size(): number {
    return this.set.size
  }

  create(enable=false): T {
    const extra = this.injector.inject<T>(this.ExtraClass)

    extra.init(this.scenario)
    
    if (enable) extra.enable()

    this.set.add(extra)
    
    return extra
  }

  destroy(extra: T): void {
    if (!this.set.has(extra)) return

    extra.destroy()

    this.set.delete(extra)
  }

  clear(): void {
    if (!this.set.size) return

    for (const extra of this.set) {
      extra.destroy()
    }

    this.set.clear()
  }

  each(f: (extra: T) => void, unsafe=false): void {
    if (!this.set.size) return

    for (const extra of unsafe ? this.set : [...this.set]) {
      f(extra)
    }
  }
}
