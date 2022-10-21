import { PROP } from '../core/types'
import { IScenario } from './scenario.model'
import { IScene } from './scene.model'
import { IDirector } from './director.model'
import { IActor } from './actor.model'
import { ScenesService } from '../services/scenes.service'

export class ScenarioClass implements IScenario {
  private _scene: IScene
  private _directors: IDirector[] = []
  private _actors: IActor[] = []

  private _isEnabled = true

  constructor() {
    const config = this.constructor[PROP.CONFIG]
    const injector = this.constructor[PROP.INJECTOR]
    const scenes = injector.inject(ScenesService)

    if (config?.scene) {
      this._scene = scenes.get(config.scene)
    }
    
    if (config.directors?.length) {
      for (const DirectorClass of config.directors) {
        this._directors.push(injector.inject(DirectorClass))
      }
    }

    if (config.actors?.length) {
      for (const ActorClass of config.actors) {
        this._actors.push(injector.inject(ActorClass))
      }
    }
  }

  get scene() {
    return this._scene
  }

  init() {
    if (this._directors.length) {
      for (const director of this._directors) {
        director.init(this)
      }
    }

    if (this._actors.length) {
      for (const actor of this._actors) {
        actor.init(this)
      }
    }

    this.onInit()
  }

  enable(data: any): void {
    if (this._isEnabled) return

    this._isEnabled = true

    if (this._directors.length) {
      for (const director of this._directors) {
        director.enable()
      }
    }

    if (this._actors.length) {
      for (const actor of this._actors) {
        actor.enable()
      }
    }

    this.onEnable(data)
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    if (this._directors.length) {
      for (const director of this._directors) {
        director.disable()
      }
    }

    if (this._actors.length) {
      for (const actor of this._actors) {
        actor.disable()
      }
    }

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    if (this._directors.length) {
      for (const director of this._directors) {
        director.frame(delta)
      }
    }

    if (this._actors.length) {
      for (const actor of this._actors) {
        actor.frame(delta)
      }
    }

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    if (this._directors.length) {
      for (const director of this._directors) {
        director.update()
      }
    }

    if (this._actors.length) {
      for (const actor of this._actors) {
        actor.update()
      }
    }

    this.onUpdate()
  }

  destroy(): void {
    this.disable()

    if (this._directors.length) {
      for (const director of this._directors) {
        director.destroy()
      }
    }

    if (this._actors.length) {
      for (const actor of this._actors) {
        actor.destroy()
      }
    }

    this.onDestroy()
  }

  onInit(): void {}
  onEnable(data: any): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
