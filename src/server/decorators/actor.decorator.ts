import { Meta, PROP, TYPE } from '../core/meta'
import { IActorClass } from './actor.model'
import { ActorClass } from './actor.class'

export function Actor(config?: {
  name?: string
}) {
  return function(Class: IActorClass) {
    Meta.set(Class, PROP.TYPE, TYPE.ACTOR)
    Meta.set(Class, PROP.CONFIG, config || {})
  }
}

Actor.Class = ActorClass
