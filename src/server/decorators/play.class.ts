import { IPlay } from './play.model';
import { Meta, PROP } from '../core/meta';
import { ScenariosService } from '../services/scenarios.service';
import { IMole } from '../../utils/mole.model';

export class PlayClass implements IPlay, IMole {
  private _isInited = false
  private _scenarios: ScenariosService
  private _spies = new Map<(method: string, ...args: any) => void, () => void>()

  constructor() {
    const config = Meta.get(this.constructor as any, PROP.CONFIG)
    const injector = Meta.get(this.constructor as any, PROP.INJECTOR)
    
    this._scenarios = injector.inject(ScenariosService)
  }

  get scenarios() {
    return this._scenarios
  }

  init(): void {
    if (this._isInited) return

    this._isInited = true

    if (this._spies.size) this._leak('init')

    this.onInit()
  }
  
  frame(delta: number): void {
    this._scenarios.current?.frame(delta)

    if (this._spies.size) this._leak('frame', delta)

    this.onFrame(delta)
  }
  
  update(): void {
    if (this._spies.size) this._leak('update')
      
    this.onUpdate()
  }
  
  destroy(): void {
    if (!this._isInited) return

    this._isInited = false

    this._scenarios.reset()

    if (this._spies.size) this._leak('destroy')

    this.onDestroy()
  }

  spy(agent: (method: string, ...args: any) => void): () => void {
    let off = this._spies.get(agent)

    if (off) return off

    off = () => this._spies.delete(agent)

    this._spies.set(agent, off)

    return off
  }

  onInit(): void {}
  onFrame(delta: number): void {}
  onUpdate(): void {}
  onDestroy(): void {}

  private _leak(method: string, ...args: any): void {
    for (const [agent, off] of this._spies) {
      agent(method, ...args)
    }
  }
}
