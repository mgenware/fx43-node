import * as nodepath from 'path';
import * as util from 'util';
const walk = require('ignore-walk');

const walkAsync = util.promisify(walk);

export default class Glob {
  static async match(path: string, ignoreFiles: string[]): Promise<string[]> {
    if (!path) {
      throw new Error('path cannot be empty');
    }

    const fullPath = nodepath.resolve(path);
    return walkAsync({
      ignoreFiles: ignoreFiles || [],
      path: fullPath,
    });
  }
}
