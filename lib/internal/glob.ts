import * as nodepath from 'path';
import * as util from 'util';
const walk = require('ignore-walk');

const walkAsync = util.promisify(walk);

export default class Glob {
  static async match(path: string, ignoreFiles: string[]): Promise<string[]> {
    if (!path) {
      throw new Error('path cannot be empty');
    }

    let ignoreSet: Set<string>|null = null;
    if (ignoreFiles) {
      ignoreSet = new Set<string>(ignoreFiles);
    }

    const fullPath = nodepath.resolve(path);
    return walkAsync({
      ignoreFiles: ignoreFiles || [],
      path: fullPath,
    }).then((files: string[]) => {
      if (ignoreSet !== null) {
        const nonEmptySet = ignoreSet as Set<string>;
        return files.filter((f) => !nonEmptySet.has(f));
      }
      return files;
    }).then((files: string[]) => {
      return files.map((file) => nodepath.join(path, file));
    });
  }
}
