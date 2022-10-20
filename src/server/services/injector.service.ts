import 'reflect-metadata'
import { PROP, TYPE } from '../core/types'
import { Service } from '../decorators/service.decorator'
import { IService } from '../decorators/service.model'

export interface IInjectableClass {
  new(...args: IService[]): IInjected
}

export type IInjected = object & {
  //
}

@Service({
  static: true,
})
export class InjectorService {
  private services = new Map<any, IService>()

  constructor() {
    this.services.set(this.constructor, this)
  }

  inject<T = unknown>(InjectableClass: IInjectableClass): T {
    if (InjectableClass[PROP.TYPE] !== TYPE.SERVICE) {
      return this._inject(InjectableClass) as T
    } else {
      if (!InjectableClass[PROP.CONFIG]?.static) return this._inject(InjectableClass) as T

      if (!this.services.has(InjectableClass)) {
        this.services.set(InjectableClass, this._inject(InjectableClass))
      }
  
      return this.services.get(InjectableClass) as T
    }
  }
  
  private _inject(DependencyClass: IInjectableClass): IInjected {
    const dependencies = Reflect.getMetadata('design:paramtypes', DependencyClass) ?? []
    const args = dependencies.map(Dependency => this.inject(Dependency))
    
    return new DependencyClass(...args)
  }
}
