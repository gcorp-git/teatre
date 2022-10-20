export interface IServiceClass {
  new(...args: IService[]): IService
}

export type IService = object & {
  //
}
