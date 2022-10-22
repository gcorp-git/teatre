import 'reflect-metadata'
import { Meta, PROP, TYPE } from '../core/meta'
import { Service } from '../decorators/service.decorator'
import { IService } from '../decorators/service.model'

export interface IClass {
  new(...args: IService[]): IInjected
}

export type IInjected = object & {
  //
}

@Service({
  static: true,
})
export class InjectorService {
  private injected = new Map<any, IService>()

  constructor() {
    this.injected.set(InjectorService, this)
  }

  inject<T = unknown>(Class: IClass): T {
    if (Meta.get(Class, PROP.TYPE) !== TYPE.SERVICE) {
      return this._inject(Class) as T
    } else {
      if (!Meta.get(Class, PROP.CONFIG)?.static) return this._inject(Class) as T

      if (!this.injected.has(Class)) {
        this.injected.set(Class, this._inject(Class))
      }
  
      return this.injected.get(Class) as T
    }
  }
  
  private _inject(Class: IClass): IInjected {
    if (!Meta.get(Class, PROP.INJECTOR)) Meta.set(Class, PROP.INJECTOR, this)

    const dependencies = Reflect.getMetadata('design:paramtypes', Class) ?? []
    const args = dependencies.map(Dependency => this.inject(Dependency))
    
    const instance = new Class(...args)

    if (args.length) {
      for (const arg of args) {
        const connect = Meta.get(arg, PROP.CONNECT)

        if (!connect) continue

        connect(instance)
      }
    }

    return instance
  }
}
