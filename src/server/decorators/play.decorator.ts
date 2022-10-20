import { PROP, TYPE } from '../core/types'
import { IPlayClass, IPlayConfig } from './play.model'
import { PlayClass } from './play.class'

export function Play(config?: IPlayConfig) {
  return function(constructor: IPlayClass) {
    constructor[PROP.TYPE] = TYPE.PLAY
    constructor[PROP.CONFIG] = config || {}
  }
}

Play.Class = PlayClass
