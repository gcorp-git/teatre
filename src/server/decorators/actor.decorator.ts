import { PROP, TYPE } from '../core/types'
import { IActorClass } from './actor.model'
import { ActorClass } from './actor.class'

export function Actor(config?: {
  name?: string
}) {
  return function(constructor: IActorClass) {
    constructor[PROP.TYPE] = TYPE.ACTOR
    constructor[PROP.CONFIG] = config || {}
  }
}

Actor.Class = ActorClass
