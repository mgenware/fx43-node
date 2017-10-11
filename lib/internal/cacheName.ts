export default class CacheName {
  static getCacheFileName(path: string): string {
    return `${path}.fx43cache`;
  }
}
