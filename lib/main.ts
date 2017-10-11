import Glob from './internal/glob';
import Reader from './internal/reader';
import Writer from './internal/writer';
import Getter from './internal/getter';
import Config from './internal/config';
import * as nodepath from 'path';

export async function start(srcDir: string, glob: string, cacheDir: string): Promise<Array<string|null>> {
  const fullGlob = nodepath.join(srcDir, glob);
  const allFiles = await Glob.match(fullGlob);
  console.log('----- all files ------');
  console.log(fullGlob, allFiles);
  console.log('=====');
  return await Promise.all(allFiles.map(async (file) => {
    const fullPath = nodepath.join(srcDir, file);
    console.log('--- fullPath ', fullPath);

    const cachePath = nodepath.join(cacheDir, file);

    const realTs = await Getter.getAsync(fullPath);
    const cachedTs = await Reader.readAsync(cachePath);
    if (realTs === null) {
      throw new Error(`Error getting lastModTime of file "${fullPath}"`);
    }
    if (cachedTs !== realTs) {
      const config = new Config();
      config.lastMod = realTs;
      await Writer.writeAsync(cachePath, config);
      return file;
    }
    return null;
  }));
}
