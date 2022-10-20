import { Service } from '../decorators/service.decorator'
import {
  IPlayConfig,
  IPlayConfigAssets,
  IPlayConfigStage,
  IPlayConfigTitle,
} from '../decorators/play.model'

@Service({
  static: true,
})
export class ConfigService {
  readonly title: IPlayConfigTitle
  readonly stage: IPlayConfigStage
  readonly assets: IPlayConfigAssets

  private static CONFIG: IPlayConfig

  constructor() {
    this.title = ConfigService.CONFIG.title
    this.stage = ConfigService.CONFIG.stage
    this.assets = ConfigService.CONFIG.assets
  }
}
