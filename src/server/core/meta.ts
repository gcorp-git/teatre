export const PROP = {
  TYPE: Symbol(),
  CONFIG: Symbol(),
  INJECTOR: Symbol(),
}

export enum TYPE {
  SERVICE,
  PLAY,
  SCENE,
  SCENARIO,
  DIRECTOR,
  ACTOR,
}

interface IClass {
  new(...args: any): object
}

export class Meta {
  private static map = new Map<IClass, Map<symbol, any>>()

  static has(Class: IClass): boolean {
    return Meta.map.has(Class)
  }

  static get(Class: IClass, key: symbol): any {
    let map = Meta.map.get(Class)

    return map ? map.get(key) : undefined
  }

  static set(Class: IClass, key: symbol, value: any): void {
    let map = Meta.map.get(Class)

    if (!map) {
      map = new Map<symbol, any>()

      Meta.map.set(Class, map)
    }

    map.set(key, value)
  }
}
