import * as globby from 'globby';

export default class Glob {
  static async match(path: string): Promise<string[]> {
    return await globby(path);
  }
}
