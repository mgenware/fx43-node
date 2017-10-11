import { promisify } from 'util';
import * as fs from 'fs';
import CacheName from './cacheName';
import Config from './config';
const writeFileAsync = promisify(fs.writeFile);

export default class Writer {
  static async writeAsync(path: string, config: Config) {
    const str = JSON.stringify(config);
    await writeFileAsync(CacheName.getCacheFileName(path), str, 'utf8');
  }
}
