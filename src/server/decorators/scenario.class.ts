import { Meta, PROP } from '../core/meta'
import { IScenario } from './scenario.model'
import { IMole } from '../../utils/mole.model'
import { IScene } from './scene.model'
import { IDirectorClass, IDirector } from './director.model'
import { IActorClass, IActor } from './actor.model'
import { ScenesService } from '../services/scenes.service'
import { InjectorService } from '../services/injector.service'
import { StageService } from '../services/stage.service'

export class ScenarioClass implements IScenario, IMole {
  private _isInited = false
  private _injector: InjectorService
  private _stage: StageService
  private _scene: IScene
  private _directors = new Map<IDirectorClass, IDirector>()
  private _actors = new Map<IActorClass, IActor>()
  private _spies = new Map<(method: string, ...args: any) => void, () => void>()

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
    if (this._isInited) return

    this._isInited = true
    
    if (this._directors.size) this._each(this._directors, 'init', this)
    if (this._actors.size) this._each(this._actors, 'init', this)

    if (this._spies.size) this._leak('init', this)

    this.onInit()
  }

  enable(data: any): void {
    if (this._isEnabled) return

    this._isEnabled = true

    if (this._directors.size) this._each(this._directors, 'enable')
    if (this._actors.size) this._each(this._actors, 'enable')

    if (this._scene) {
      this._isCameraAttached = true
      this._stage.camera.attach(this._scene)
    }

    if (this._spies.size) this._leak('enable', data)

    this.onEnable(data)
  }

  disable(): void {
    if (!this._isEnabled) return

    this._isEnabled = false

    if (this._directors.size) this._each(this._directors, 'disable')
    if (this._actors.size) this._each(this._actors, 'disable')

    if (this._isCameraAttached) {
      this._isCameraAttached = false
      this._stage.camera.detach()
    }

    if (this._spies.size) this._leak('disable')

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    if (this._directors.size) this._each(this._directors, 'frame', delta)
    if (this._actors.size) this._each(this._actors, 'frame', delta)

    if (this._spies.size) this._leak('frame', delta)

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    if (this._directors.size) this._each(this._directors, 'update')
    if (this._actors.size) this._each(this._actors, 'update')

    if (this._spies.size) this._leak('update')

    this.onUpdate()
  }

  destroy(): void {
    if (!this._isInited) return

    this._isInited = false

    this.disable()

    if (this._directors.size) this._each(this._directors, 'destroy')
    if (this._actors.size) this._each(this._actors, 'destroy')

    this._directors.clear()
    this._actors.clear()

    if (this._spies.size) this._leak('destroy')

    this.onDestroy()
  }

  director<T extends IDirectorClass>(Class: T): InstanceType<T> {
    return this._directors.get(Class) as InstanceType<T>
  }

  actor<T extends IActorClass>(Class: T): InstanceType<T> {
    return this._actors.get(Class) as InstanceType<T>
  }

  spy(agent: (method: string, ...args: any) => void): () => void {
    let off = this._spies.get(agent)

    if (off) return off

    off = () => this._spies.delete(agent)

    this._spies.set(agent, off)

    return off
  }

  onInit(): void {}
  onEnable(data: any): void {}
  onDisable(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}

  private _each(map: Map<any, any>, method: string, ...args: any): void {
    for (const [key, value] of map) {
      value[method](...args)
    }
  }

  private _leak(method: string, ...args: any): void {
    for (const [agent, off] of this._spies) {
      agent(method, ...args)
    }
  }
}
