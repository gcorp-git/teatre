import { Subscriptions } from '../../utils/subscriptions'
import { IPlayConfig, IPlayConfigStage } from '../services/config.service'
import { IItem } from '../services/renderer.service'

export interface IAPI {
  send: (sygnal: string, data?: any) => void
  on: (sygnal: string, listener: Listener) => void
  off: (sygnal: string, listener: Listener) => void
}

type Listener = (event: any, payload: any) => void

export enum SYGNAL {
  INIT_READY = 'init:ready',
  INIT_CONFIG = 'init:config',
  INIT_LOADED = 'init:loaded',
  STAGE_RENDER = 'stage:render',
  STAGE_UPDATE = 'stage:update',
  EVENTS_UPDATE = 'events:update',
  WINDOW_RESIZE = 'window:resize',
}

export class API {
  private subs = new Subscriptions()

  constructor(private api: IAPI) {
    //
  }

  send(sygnal: SYGNAL.INIT_READY): void
  send(sygnal: SYGNAL.INIT_LOADED, payload: { images: { width: number, height: number }[] }): void
  send(sygnal: SYGNAL.WINDOW_RESIZE, payload: { width: number, height: number }): void
  send(sygnal: SYGNAL.EVENTS_UPDATE, payload: [event: string, payload: any][]): void
  send(sygnal: SYGNAL, payload?: any): void {
    this.api.send(sygnal, payload)
  }

  on(sygnal: SYGNAL.INIT_CONFIG, f: (config: IPlayConfig) => void): () => void
  on(sygnal: SYGNAL.STAGE_RENDER, f: (buffer: IItem[]) => void): () => void
  on(sygnal: SYGNAL.STAGE_UPDATE, f: (stage: IPlayConfigStage) => void): () => void
  on(sygnal: SYGNAL, f: (...args: any) => void): () => void {
    const listener: Listener = (event, data) => f(data)

    this.subs.on(sygnal, listener)
    this.api.on(sygnal, listener)

    return () => {
      this.subs.off(sygnal, listener)
      this.api.off(sygnal, listener)
    }
  }

  reset(): void {
    this.subs.names.forEach(sygnal => {
      this.subs.each(sygnal, listener => {
        this.api.off(sygnal, listener)
      })
    })

    this.subs.clear()
  }
}
