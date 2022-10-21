import { describe, expect, test } from '@jest/globals'
import { Service } from '../../../src/server/decorators/service.decorator'
import { InjectorService } from '../../../src/server/services/injector.service'

@Service({
  static: true,
})
class BarService {
  constructor() {}
  test() {
    return 'bar'
  }
}

describe(`InjectorService`, () => {
  test(`injector.inject(InjectorService)`, () => {
    const injector = new InjectorService()
    const injector2 = injector.inject<InjectorService>(InjectorService)
    expect([injector === injector2]).toEqual([true])
  })
  test(`injector.inject(BarService)`, () => {
    const injector = new InjectorService()
    const bar = injector.inject<BarService>(BarService)
    const bar2 = injector.inject<BarService>(BarService)
    expect([bar === bar2, bar.test()]).toEqual([true, 'bar'])
  })
  test(`injector.inject(FooService) static=true`, () => {
    @Service({
      static: true,
    })
    class FooService {
      constructor(public bar: BarService) {}
      test() {
        return 'foo'
      }
    }

    const injector = new InjectorService()
    const foo = injector.inject<FooService>(FooService)
    const foo2 = injector.inject<FooService>(FooService)
    expect([foo === foo2, foo.test(), foo.bar.test()]).toEqual([true, 'foo', 'bar'])
  })
  test(`injector.inject(FooService) static=false`, () => {
    @Service({
      static: false,
    })
    class FooService {
      constructor(public bar: BarService) {}
      test() {
        return 'foo'
      }
    }

    const injector = new InjectorService()
    const foo = injector.inject<FooService>(FooService)
    const foo2 = injector.inject<FooService>(FooService)
    expect([foo === foo2, foo.test(), foo.bar.test()]).toEqual([false, 'foo', 'bar'])
  })
  test(`injector.inject(FooService) <=> BarService, ZarService`, () => {
    class Zar {
      test() {
        return 'zar'
      }
    }

    @Service({
      static: false,
    })
    class FooService {
      constructor(
        public bar: BarService,
        public zar: Zar,
      ) {}
      test() {
        return 'foo'
      }
    }
    
    const injector = new InjectorService()
    const foo = injector.inject<FooService>(FooService)
    const foo2 = injector.inject<FooService>(FooService)
    expect([foo.test(), foo.bar.test(), foo.zar.test(), foo.zar === foo2.zar]).toEqual(['foo', 'bar', 'zar', false])
  })
})
