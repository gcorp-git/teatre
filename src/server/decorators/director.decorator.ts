import { Meta, PROP, TYPE } from '../core/meta'
import { IDirectorClass } from './director.model'
import { DirectorClass } from './director.class'

export function Director(config?: {
  name?: string
}) {
  return function(Class: IDirectorClass) {
    Meta.set(Class, PROP.TYPE, TYPE.DIRECTOR)
    Meta.set(Class, PROP.CONFIG, config || {})
  }
}

Director.Class = DirectorClass
