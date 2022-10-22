import { Service } from '../decorators/service.decorator'
import { InjectorService } from './injector.service'
import { IScene, ISceneClass } from '../decorators/scene.model'

@Service({
  static: true,
})
export class ScenesService {
  private injected = new Map<ISceneClass, IScene>()

  constructor(
    private injector: InjectorService,
  ) {}

  get(SceneClass: ISceneClass): IScene {
    if (!this.injected.has(SceneClass)) {
      const scene = this.injector.inject<IScene>(SceneClass)

      this.injected.set(SceneClass, scene)

      scene.init()

      return scene
    }

    return this.injected.get(SceneClass)
  }

  reset() {
    for (const [SceneClass, scene] of this.injected) {
      scene.destroy()
    }

    this.injected.clear()
  }

}
