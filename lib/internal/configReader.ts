import { promisify } from 'util';
import * as fs from 'fs';
import Config from './config';
const readFileAsync = promisify(fs.readFile);

export default class ConfigReader {
  static async readAsync(path: string): Promise<Config> {
    const jsonStr = await readFileAsync(path, 'utf8');
    return JSON.parse(jsonStr);
  }
}
