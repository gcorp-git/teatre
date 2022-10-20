import { PROP, TYPE } from '../core/types'
import { IScenarioClass } from './scenario.model'
import { ScenarioClass } from './scenario.class'

export function Scenario(config?: {
  name?: string
}) {
  return function(constructor: IScenarioClass) {
    constructor[PROP.TYPE] = TYPE.SCENE
    constructor[PROP.CONFIG] = config || {}
  }
}

Scenario.Class = ScenarioClass
