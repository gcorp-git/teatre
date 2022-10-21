import { Meta, PROP } from '../core/meta'
import { IScenario } from './scenario.model'
import { IScene } from './scene.model'
import { IDirectorClass, IDirector } from './director.model'
import { IActorClass, IActor } from './actor.model'
import { ScenesService } from '../services/scenes.service'
import { InjectorService } from '../services/injector.service'

export class ScenarioClass implements IScenario {
  private _scene: IScene
  private _directors = new Map<IDirectorClass, IDirector>()
  private _actors = new Map<IActorClass, IActor>()

  private _isEnabled = false

  constructor() {
    const config = Meta.get(this.constructor as any, PROP.CONFIG)
    const injector = Meta.get(this.constructor as any, PROP.INJECTOR) as InjectorService
    const scenes = injector.inject<ScenesService>(ScenesService)

    if (config?.scene) {
      this._scene = scenes.get(config.scene)
    }
    
    if (config.directors?.length) {
      for (const DirectorClass of config.directors) {
        this._directors.set(DirectorClass, injector.inject<IDirector>(DirectorClass))
      }
    }

    if (config.actors?.length) {
      for (const ActorClass of config.actors) {
        this._actors.set(ActorClass, injector.inject<IActor>(ActorClass))
      }
    }
  }

  get scene() {
    return this._scene
  }

  get directors() {
    return this._directors
  }

  get actors() {
    return this._actors
  }

  init() {
    if (this._directors.size) {
      for (const [DirectorClass, director] of this._directors) {
        director.init(this)
      }
    }

    if (this._actors.size) {
      for (const [ActorClass, actor] of this._actors) {
        actor.init(this)
      }
    }

    this.onInit()
  }

  enable(data: any): void {
    if (this._isEnabled) return

    this._isEnabled = true

    if (this._directors.size) {
      for (const [DirectorClass, director] of this._directors) {
        director.enable()
      }
    }

    if (this._actors.size) {
      for (const [ActorClass, actor] of this._actors) {
        actor.enable()
      }
    }

    this.onEnable(data)
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    if (this._directors.size) {
      for (const [DirectorClass, director] of this._directors) {
        director.disable()
      }
    }

    if (this._actors.size) {
      for (const [ActorClass, actor] of this._actors) {
        actor.disable()
      }
    }

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    if (this._directors.size) {
      for (const [DirectorClass, director] of this._directors) {
        director.frame(delta)
      }
    }

    if (this._actors.size) {
      for (const [ActorClass, actor] of this._actors) {
        actor.frame(delta)
      }
    }

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    if (this._directors.size) {
      for (const [DirectorClass, director] of this._directors) {
        director.update()
      }
    }

    if (this._actors.size) {
      for (const [ActorClass, actor] of this._actors) {
        actor.update()
      }
    }

    this.onUpdate()
  }

  destroy(): void {
    this.disable()

    if (this._directors.size) {
      for (const [DirectorClass, director] of this._directors) {
        director.destroy()
      }
    }

    this._directors.clear()

    if (this._actors.size) {
      for (const [ActorClass, actor] of this._actors) {
        actor.destroy()
      }
    }

    this._actors.clear()

    this.onDestroy()
  }

  onInit(): void {}
  onEnable(data: any): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}
}
