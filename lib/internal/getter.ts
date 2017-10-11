import { promisify } from 'util';
import * as fs from 'fs';
const statAsync = promisify(fs.stat);

export default class Getter {
  static async getAsync(path: string): Promise<string> {
    const stat = await statAsync(path);
    return stat.mtime.toJSON();
  }
}
