import { Meta, PROP } from '../core/meta'
import { IScenario } from './scenario.model'
import { IScene } from './scene.model'
import { IDirectorClass, IDirector } from './director.model'
import { IActorClass, IActor } from './actor.model'
import { ScenesService } from '../services/scenes.service'
import { InjectorService } from '../services/injector.service'
import { StageService } from '../services/stage.service'

export class ScenarioClass implements IScenario {
  private _injector: InjectorService
  private _stage: StageService
  private _scene: IScene
  private _directors = new Map<IDirectorClass, IDirector>()
  private _actors = new Map<IActorClass, IActor>()

  private _isEnabled = false
  private _isCameraAttached = false

  constructor() {
    const config = Meta.get(this.constructor as any, PROP.CONFIG)

    this._injector = Meta.get(this.constructor as any, PROP.INJECTOR) as InjectorService
    this._stage = this._injector.inject(StageService)

    if (config?.scene) {
      const scenes = this._injector.inject<ScenesService>(ScenesService)
  
      this._scene = scenes.get(config.scene)
    }
    
    if (config.directors?.length) {
      for (const DirectorClass of config.directors) {
        this._directors.set(DirectorClass, this._injector.inject<IDirector>(DirectorClass))
      }
    }

    if (config.actors?.length) {
      for (const ActorClass of config.actors) {
        this._actors.set(ActorClass, this._injector.inject<IActor>(ActorClass))
      }
    }
  }

  get scene() {
    return this._scene
  }

  init() {
    this._each(this._directors, 'init', this)
    this._each(this._actors, 'init', this)

    this.onInit()
  }

  enable(data: any): void {
    if (this._isEnabled) return

    this._isEnabled = true

    this._each(this._directors, 'enable')
    this._each(this._actors, 'enable')

    if (this._scene) {
      this._isCameraAttached = true
      this._stage.camera.attach(this._scene)
    }

    this.onEnable(data)
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    if (this._isCameraAttached) {
      this._isCameraAttached = false
      this._stage.camera.detach()
    }

    this._each(this._directors, 'disable')
    this._each(this._actors, 'disable')

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    this._each(this._directors, 'frame', delta)
    this._each(this._actors, 'frame', delta)

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    this._each(this._directors, 'update')
    this._each(this._actors, 'update')

    this.onUpdate()
  }

  destroy(): void {
    this.disable()

    this._each(this._directors, 'destroy')
    this._each(this._actors, 'destroy')

    this._directors.clear()
    this._actors.clear()

    this.onDestroy()
  }

  director<T extends IDirectorClass>(Class: T): InstanceType<T> {
    return this._directors.get(Class) as InstanceType<T>
  }

  actor<T extends IActorClass>(Class: T): InstanceType<T> {
    return this._actors.get(Class) as InstanceType<T>
  }

  onInit(): void {}
  onEnable(data: any): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}

  private _each(map: Map<any, any>, action: string, ...args: any): void {
    if (!map.size) return

    for (const [key, value] of map) {
      value[action](...args)
    }
  }
}
