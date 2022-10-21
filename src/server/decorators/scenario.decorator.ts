import { Meta, PROP, TYPE } from '../core/meta'
import { IScenarioClass } from './scenario.model'
import { ScenarioClass } from './scenario.class'
import { ISceneClass } from './scene.model'
import { IDirectorClass } from './director.model'
import { IActorClass } from './actor.model'

export function Scenario(config?: {
  name?: string
  scene?: ISceneClass
  directors?: IDirectorClass[]
  actors?: IActorClass[]
}) {
  return function(Class: IScenarioClass) {
    Meta.set(Class, PROP.TYPE, TYPE.SCENARIO)
    Meta.set(Class, PROP.CONFIG, config || {})
  }
}

Scenario.Class = ScenarioClass
