export const PROP = {
  TYPE: Symbol(),
  CONFIG: Symbol(),
  INJECTOR: Symbol(),
  CONNECT: Symbol(),
}

export enum TYPE {
  SERVICE,
  PLAY,
  SCENE,
  SCENARIO,
  DIRECTOR,
  ACTOR,
}

export class Meta {
  private static map = new Map<any, Map<symbol, any>>()

  static has(o: any): boolean {
    return Meta.map.has(o)
  }

  static get(o: any, key: symbol): any {
    let map = Meta.map.get(o)

    return map ? map.get(key) : undefined
  }

  static set(o: any, key: symbol, value: any): void {
    let map = Meta.map.get(o)

    if (!map) {
      map = new Map<symbol, any>()

      Meta.map.set(o, map)
    }

    map.set(key, value)
  }
}
