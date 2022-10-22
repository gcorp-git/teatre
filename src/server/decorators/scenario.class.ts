import { Meta, PROP } from '../core/meta'
import { IScenario } from './scenario.model'
import { IMole } from '../../utils/mole.model'
import { IScene } from './scene.model'
import { IDirectorClass, IDirector } from './director.model'
import { IActorClass, IActor } from './actor.model'
import { ScenesService } from '../services/scenes.service'
import { InjectorService } from '../services/injector.service'
import { StageService } from '../services/stage.service'
import { Extras } from './scenario/extras'

export class ScenarioClass implements IScenario, IMole {
  private _isInited = false
  private _injector: InjectorService
  private _stage: StageService
  private _scene: IScene
  private _directors = new Map<IDirectorClass, IDirector>()
  private _actors = new Map<IActorClass, IActor>()
  private _extras = new Map<IActorClass, Extras<IActor>>()
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

    if (config.extras?.length) {
      for (const ExtraClass of config.extras) {
        this._extras.set(ExtraClass, new Extras<IActor>(this, this._injector, ExtraClass))
      }
    }

    Object.freeze(this._extras)
  }

  get scene() {
    return this._scene
  }

  init() {
    if (this._isInited) return

    this._isInited = true
    
    if (this._directors.size) this._withDirectors('init', this)
    if (this._actors.size) this._withActors('init', this)
    if (this._extras.size) this._withExtras('init', this)

    if (this._spies.size) this._leak('init', this)

    this.onInit()
  }

  enable(data: any): void {
    if (this._isEnabled) return

    this._isEnabled = true

    if (this._directors.size) this._withDirectors('enable')
    if (this._actors.size) this._withActors('enable')
    if (this._extras.size) this._withExtras('enable')

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

    if (this._directors.size) this._withDirectors('disable')
    if (this._actors.size) this._withActors('disable')
    if (this._extras.size) this._withExtras('disable')

    if (this._isCameraAttached) {
      this._isCameraAttached = false
      this._stage.camera.detach()
    }

    if (this._spies.size) this._leak('disable')

    this.onDisable()
  }

  frame(delta: number): void {
    if (!this._isEnabled) return

    if (this._directors.size) this._withDirectors('frame', delta)
    if (this._actors.size) this._withActors('frame', delta)
    if (this._extras.size) this._withExtras('frame', delta)

    if (this._spies.size) this._leak('frame', delta)

    this.onFrame(delta)
  }

  update(): void {
    if (!this._isEnabled) return

    if (this._directors.size) this._withDirectors('update')
    if (this._actors.size) this._withActors('update')
    if (this._extras.size) this._withExtras('update')

    if (this._spies.size) this._leak('update')

    this.onUpdate()
  }

  destroy(): void {
    if (!this._isInited) return

    this._isInited = false

    this.disable()

    if (this._directors.size) this._withDirectors('destroy')
    if (this._actors.size) this._withActors('destroy')
    if (this._extras.size) this._withExtras('destroy')

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

  extras<T extends IActorClass>(Class: T): Extras<InstanceType<T>> {
    return this._extras.get(Class) as Extras<InstanceType<T>>
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

  private _withDirectors(method: string, ...args: any): void {
    for (const [DirectorClass, director] of this._directors) {
      director[method](...args)
    }
  }

  private _withActors(method: string, ...args: any): void {
    for (const [ActorClass, actor] of this._actors) {
      actor[method](...args)
    }
  }

  private _withExtras(method: string, ...args: any): void {
    for (const [ExtraClass, extras] of this._extras) {
      extras.each(extra => extra[method](...args), true)
    }
  }

  private _leak(method: string, ...args: any): void {
    for (const [agent, off] of this._spies) {
      agent(method, ...args)
    }
  }
}
