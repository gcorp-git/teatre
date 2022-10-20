import { Subscriptions } from '../../utils/subscriptions'
import { IPlayConfig, IPlayConfigStage } from '../services/config.service'
import { IItem } from '../services/renderer.service'

export interface IAPI {
  send: (channel: string, data?: any) => void
  on: (channel: string, listener: Listener) => void
  off: (channel: string, listener: Listener) => void
}

type Listener = (event: any, payload: any) => void

enum CHANNEL {
  INIT_CONFIG = 'init:config',
  STAGE_RENDER = 'stage:render',
  STAGE_UPDATE = 'stage:update',
  INIT_READY = 'init:ready',
  INIT_LOADED = 'init:loaded',
  WINDOW_RESIZE = 'window:resize',
  EVENTS_UPDATE = 'events:update',
}

export class API {
  private subs: Subscriptions

  constructor(private api: IAPI) {
    this.subs = new Subscriptions()
  }

  onInitConfig(f: (config: IPlayConfig) => void): void {
    this._on(CHANNEL.INIT_CONFIG, (event, data) => f(data as IPlayConfig))
  }

  onStageRender(f: (buffer: IItem[]) => void): void {
    this._on(CHANNEL.STAGE_RENDER, (event, data) => f(data as IItem[]))
  }

  onStageUpdate(f: (stage: IPlayConfigStage) => void): void {
    this._on(CHANNEL.STAGE_UPDATE, (event, data) => f(data as IPlayConfigStage))
  }

  sendInitReady(): void {
    this.api.send(CHANNEL.INIT_READY)
  }

  sendInitLoaded(payload: { images: { width: number, height: number }[] }): void {
    this.api.send(CHANNEL.INIT_LOADED, payload)
  }
  
  sendWindowResize(payload: { width: number, height: number }): void {
    this.api.send(CHANNEL.WINDOW_RESIZE, payload)
  }
  
  sendEventsUpdate(payload: [event: string, payload: any][]): void {
    this.api.send(CHANNEL.EVENTS_UPDATE, payload)
  }

  unsubscribe(): void {
    this.subs.clear()
  }

  private _on(channel: CHANNEL, listener: Listener): void {
    this.subs.on(channel, listener)
    this.api.on(channel, listener)
  }
}
