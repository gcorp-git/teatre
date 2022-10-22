export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

export function ring(min: number, value: number, max: number): number {
  const size = max - min

  return min + ((value % size + size) % size)
}

export function deepFreeze(o: unknown): unknown {
  Object.freeze(o)

  if (!(o instanceof Object)) return o

  for (const prop of Object.getOwnPropertyNames(o)) {
    const v = (o as any)[prop]

    if (v instanceof Object && !Object.isFrozen(v)) deepFreeze(v)
  }

  return o
}

export function filterKeys(
  o: { [k: string]: any },
  opts: { include?: string[], exclude?: string[] },
  alwaysReturnObject = false,
): { [k: string]: any } {
  if (!o) return alwaysReturnObject ? {} : undefined
  if (!opts?.include?.length && !opts?.exclude?.length) return o

  const result: { [k: string]: any } = {}

  let counter = 0

  for (const k in o) {
    if (opts.include) {
      if (!opts.include.includes(k)) continue
    } else {
      if (opts.exclude && opts.exclude.includes(k)) continue
    }

    result[k] = o[k]
    counter++
  }

  return counter ? result : alwaysReturnObject ? {} : undefined
}
