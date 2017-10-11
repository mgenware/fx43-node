import ConfigReader from './configReader';
import CacheName from './cacheName';

export default class Reader {
   static async readAsync(path: string): Promise<string|null> {
     const config = await ConfigReader.readAsync(CacheName.getCacheFileName(path));
     return config.lastMod;
   }
}
