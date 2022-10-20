export abstract class Loader<T> {
  abstract load(urls: string[], transform?: (url: string) => string): Promise<T[]>
}
