import { PROP, TYPE } from '../core/types'
import { ISceneClass } from './scene.model'
import { SceneClass } from './scene.class'

export function Scene(config?: {
  name?: string
}) {
  return function(constructor: ISceneClass) {
    constructor[PROP.TYPE] = TYPE.SCENE
    constructor[PROP.CONFIG] = config || {}
  }
}

Scene.Class = SceneClass
