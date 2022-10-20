export enum TYPE {
  IMAGE,
  SCREEN,
  DRAFT,
}

export type IItem = [
  type?: TYPE,
  data?: unknown,
  src?: ISrc | 0,
  dest?: IDest | 0,
  filters?: IFilters,
]

export type ISrc = [x: number, y: number, width: number, height: number]

export type IDest = [x: number, y: number, width: number, height: number]

export interface IFilters {
  filter?: string
  operation?: string
  rotate?: number
  scale?: { x: number, y: number }
  skew?: { x: number, y: number }
}
