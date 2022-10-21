import { PROP, TYPE } from '../core/types'
import { IDirectorClass } from './director.model'
import { DirectorClass } from './director.class'

export function Director(config?: {
  name?: string
}) {
  return function(constructor: IDirectorClass) {
    constructor[PROP.TYPE] = TYPE.DIRECTOR
    constructor[PROP.CONFIG] = config || {}
  }
}

Director.Class = DirectorClass
