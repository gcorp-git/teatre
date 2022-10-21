import 'reflect-metadata'
import { PROP, TYPE } from '../core/types'
import { Service } from '../decorators/service.decorator'
import { IService } from '../decorators/service.model'

export interface IConstructor {
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

  inject<T = unknown>(Constructor: IConstructor): T {
    if (Constructor[PROP.TYPE] !== TYPE.SERVICE) {
      return this._inject(Constructor) as T
    } else {
      if (!Constructor[PROP.CONFIG]?.static) return this._inject(Constructor) as T

      if (!this.services.has(Constructor)) {
        this.services.set(Constructor, this._inject(Constructor))
      }
  
      return this.services.get(Constructor) as T
    }
  }
  
  private _inject(Constructor: IConstructor): IInjected {
    if (!Constructor[PROP.INJECTOR]) Constructor[PROP.INJECTOR] = this

    const dependencies = Reflect.getMetadata('design:paramtypes', Constructor) ?? []
    const args = dependencies.map(Dependency => this.inject(Dependency))
    
    return new Constructor(...args)
  }
}
