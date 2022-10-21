import { Meta, PROP, TYPE } from '../core/meta'
import { IServiceClass } from './service.model'

export function Service(config?: {
  static: boolean
}) {
  return function(Class: IServiceClass) {
    Meta.set(Class, PROP.TYPE, TYPE.SERVICE)
    Meta.set(Class, PROP.CONFIG, config || {})
  }
}
