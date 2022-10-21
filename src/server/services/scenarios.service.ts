import { Service } from '../decorators/service.decorator'
import { IScenario, IScenarioClass } from '../decorators/scenario.model'
import { InjectorService, IInjectableClass } from './injector.service'

interface IStackItem {
  scenario: IScenario
  data: any
}

@Service({
  static: true,
})
export class ScenariosService {
  private stack: IStackItem[] = []
  private injected = new Map<IScenarioClass, IScenario>()

  constructor(
    private injector: InjectorService,
  ) {}

  get current() {
    return this.stack[this.stack.length - 1]?.scenario
  }

  pop(): IScenario {
    const current = this.stack.pop()

		if (current) current.scenario?.onDisable()

		const last = this.stack[this.stack.length - 1]

    if (last) last.scenario?.onEnable(last?.data)

		return current?.scenario
  }

  push(ScenarioClass: IScenarioClass, data?: any): void {
    const last = this.stack[this.stack.length - 1]

		if (last) last.scenario?.onDisable()

		const scenario = this._inject(ScenarioClass)

		this.stack.push({ scenario, data })
		
    const current = this.stack[this.stack.length - 1]

    if (current) current.scenario?.onEnable(data)
  }
  
  replace(ScenarioClass: IScenarioClass, data?: any): void {
    const last = this.stack.pop()

    if (last) last.scenario?.onDisable()

    const scenario = this._inject(ScenarioClass)

		this.stack.push({ scenario, data })
		
    const current = this.stack[this.stack.length - 1]

    if (current) current.scenario?.onEnable(data)
  }

  private _inject(ScenarioClass: IScenarioClass): IScenario {
    if (!this.injected.has(ScenarioClass)) {
      const scenario = this.injector.inject<IScenario>(ScenarioClass as IInjectableClass)

      this.injected.set(ScenarioClass, scenario)
    }

    return this.injected.get(ScenarioClass)
  }
}