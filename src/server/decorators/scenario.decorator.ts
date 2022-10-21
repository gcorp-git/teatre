import { PROP, TYPE } from '../core/types'
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
  return function(constructor: IScenarioClass) {
    constructor[PROP.TYPE] = TYPE.SCENARIO
    constructor[PROP.CONFIG] = config || {}
  }
}

Scenario.Class = ScenarioClass
