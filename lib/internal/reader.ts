import ConfigReader from './configReader';

export default class Reader {
   static async readAsync(path: string): Promise<string|null> {
     const config = await ConfigReader.readAsync(path);
     return config.lastMod;
   }
}
