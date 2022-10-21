import { Meta, PROP, TYPE } from '../core/meta'
import { ISceneClass } from './scene.model'
import { SceneClass } from './scene.class'

export function Scene(config?: {
  name?: string
  options?: {
    integerCoordinates: boolean
  }
}) {
  return function(Class: ISceneClass) {
    Meta.set(Class, PROP.TYPE, TYPE.SCENE)
    Meta.set(Class, PROP.CONFIG, config || {})
  }
}

Scene.Class = SceneClass
