import { promisify } from 'util';
import * as fs from 'fs';
import Config from './config';
import * as nodepath from 'path';
const mkdirp = require('mkdirp-promise') as any;

const writeFileAsync = promisify(fs.writeFile);

export default class Writer {
  static async writeAsync(path: string, config: Config) {
    const baseDir = nodepath.dirname(path);
    await mkdirp(baseDir);
    const str = JSON.stringify(config);
    await writeFileAsync(path, str, 'utf8');
  }
}
