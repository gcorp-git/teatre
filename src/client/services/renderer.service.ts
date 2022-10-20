export const ERROR = {
  INCORRECT_SPRITE_TYPE: 'RendererService: Incorrect sprite type',
  INCORRECT_SPRITE_IMAGE: 'RendererService: Incorrect sprite image',
  INCORRECT_DRAFT_SRC: 'RendererService: Incorrect draft src',
}

export type IItem = [
  type?: TYPE,
  data?: unknown,
  src?: ISrc | 0,
  dest?: IDest | 0,
  filters?: IFilters,
]

export enum TYPE {
  IMAGE,
  SCREEN,
  DRAFT,
}

enum POS {
  TYPE = 0,
  DATA = 1,
  SRC = 2,
  DEST = 3,
  FILTERS = 4,
}

type ISrc = [x: number, y: number, width: number, height: number]

type IDest = [x: number, y: number, width: number, height: number]

interface IFilters {
  filter?: string
  operation?: string
  rotate?: number
  scale?: { x: number, y: number }
  skew?: { x: number, y: number }
}

export interface IDraft {
  $canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

export class RendererService {
  render({ ctx, width, height, buffer, images, draft }: {
    ctx: CanvasRenderingContext2D
    width: number
    height: number
    buffer: IItem[]
    images: HTMLImageElement[]
    draft: IDraft
  }): void {
    ctx.clearRect(0, 0, width, height)
  
    for (const sprite of buffer) {
      renderSprite(ctx, images, sprite, draft)
    }
  }
}

function renderSprite(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  sprite: IItem,
  draft: IDraft
): void {
  switch (sprite[POS.TYPE]) {
    case TYPE.IMAGE: return renderSpriteImage(ctx, images, sprite, draft)
    case TYPE.SCREEN: return renderSpriteScreen(ctx, images, sprite, draft)
    case TYPE.DRAFT: return renderSpriteDraft(ctx, images, sprite, draft)
  }

  throw ERROR.INCORRECT_SPRITE_TYPE
}

function renderSpriteImage(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  sprite: IItem,
  draft: IDraft
): void {
  const image = images[sprite[POS.DATA] as number]

  if (!image) throw ERROR.INCORRECT_SPRITE_IMAGE
  
  const src = sprite[POS.SRC] as ISrc

  const sx = src?.[0] ?? 0
  const sy = src?.[1] ?? 0
  const sw = src?.[2] || image.width
  const sh = src?.[3] || image.height
  
  const dest = sprite[POS.DEST] as IDest

  const dx = dest?.[0] ?? 0
  const dy = dest?.[1] ?? 0
  const dw = dest?.[2] || sw
  const dh = dest?.[3] || sh

  // todo: apply filters

  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
}

function renderSpriteScreen(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  sprite: IItem,
  draft: IDraft
): void {
  for (const _sprite of sprite[POS.DATA] as IItem[]) {
    renderSprite(ctx, images, _sprite, draft)
  }
}

function renderSpriteDraft(
  ctx: CanvasRenderingContext2D,
  images: HTMLImageElement[],
  sprite: IItem,
  draft: IDraft
): void {
  const src = sprite[POS.SRC] as ISrc

  if (!src) throw ERROR.INCORRECT_DRAFT_SRC

  const sx = src[0]
  const sy = src[1]
  const sw = src[2]
  const sh = src[3]

  const dest = sprite[POS.DEST] as IDest

  const dx = dest?.[0] ?? 0
  const dy = dest?.[1] ?? 0
  const dw = dest?.[2] || sw
  const dh = dest?.[3] || sh

  draft.$canvas.width = sw
  draft.$canvas.height = sh

  draft.ctx.clearRect(0, 0, sw, sh)

  for (const [method, args] of sprite[POS.DATA] as [method: string, args: any[]][]) {
    if (method) {
      (draft.ctx as any)[method](...args)
    } else {
      (draft.ctx as any)[args[0]] = [args[1]]
    }
  }

  // todo: apply filters

  ctx.drawImage(draft.$canvas, sx, sy, sw, sh, dx, dy, dw, dh)
}
