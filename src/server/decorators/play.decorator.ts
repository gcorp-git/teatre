import { Meta, PROP, TYPE } from '../core/meta'
import { IPlayClass, IPlayConfig } from './play.model'
import { PlayClass } from './play.class'

export function Play(config?: IPlayConfig) {
  return function(Class: IPlayClass) {
    Meta.set(Class, PROP.TYPE, TYPE.PLAY)
    Meta.set(Class, PROP.CONFIG, config || {})
  }
}

Play.Class = PlayClass
