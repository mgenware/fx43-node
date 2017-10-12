import Glob from './internal/glob';
import Reader from './internal/reader';
import Writer from './internal/writer';
import Getter from './internal/getter';
import Config from './internal/config';
import CacheName from './internal/cacheName';
import * as nodepath from 'path';

export async function start(srcDir: string, glob: string, cacheDir: string): Promise<Array<string|null>> {
  const fullSrcDir = nodepath.resolve(srcDir);
  const fullGlob = nodepath.join(fullSrcDir, glob);
  const fullCacheDir = nodepath.resolve(cacheDir);
  const allFiles = await Glob.match(fullGlob);

  return await Promise.all(allFiles.map(async (absFile) => {
    const relFile = nodepath.relative(fullSrcDir, absFile);
    const cachePath = CacheName.getCacheFileName(nodepath.join(fullCacheDir, relFile));

    const realTs = await Getter.getAsync(absFile);
    let cachedTs: string|null = null;
    try {
      cachedTs = await Reader.readAsync(cachePath);
    } catch (err) { } // tslint:disable-line

    if (!realTs) {
      throw new Error(`Error getting lastModTime of file "${absFile}"`);
    }
    if (cachedTs !== realTs) {
      const config = new Config();
      config.lastMod = realTs;
      await Writer.writeAsync(cachePath, config);
      return relFile;
    }
    return null;
  })).then((results) => {
    return results.filter((f) => f !== null);
  });
}
