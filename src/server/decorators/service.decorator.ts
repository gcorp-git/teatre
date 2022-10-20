import { PROP, TYPE } from '../core/types'
import { IServiceClass } from './service.model'

export function Service(config?: {
  static: boolean
}) {
  return function(constructor: IServiceClass) {
    constructor[PROP.TYPE] = TYPE.SERVICE
    constructor[PROP.CONFIG] = config || {}
  }
}
