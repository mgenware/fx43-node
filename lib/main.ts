import Glob from './internal/glob';
import Reader from './internal/reader';
import Writer from './internal/writer';
import Getter from './internal/getter';
import Config from './internal/config';
import * as nodepath from 'path';

export async function start(srcDir: string, glob: string, cacheDir: string): Promise<Array<string|null>> {
  const fullSrcDir = nodepath.resolve(srcDir);
  const fullGlob = nodepath.join(fullSrcDir, glob);
  const allFiles = await Glob.match(fullGlob);
  console.log('----- all files ------');
  console.log(fullGlob, allFiles);
  console.log('=====');
  return await Promise.all(allFiles.map(async (absFile) => {
    console.log('--- fullPath ', absFile);
    const relFile = nodepath.relative(fullSrcDir, absFile);
    console.log('--- relaPath', relFile);

    const cachePath = nodepath.join(cacheDir, relFile);

    const realTs = await Getter.getAsync(absFile);
    const cachedTs = await Reader.readAsync(cachePath);
    if (realTs === null) {
      throw new Error(`Error getting lastModTime of file "${absFile}"`);
    }
    if (cachedTs !== realTs) {
      const config = new Config();
      config.lastMod = realTs;
      await Writer.writeAsync(cachePath, config);
      return relFile;
    }
    return null;
  }));
}
