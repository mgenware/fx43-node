import Reader from './internal/reader';
import Writer from './internal/writer';
import Getter from './internal/getter';
import Config from './internal/config';
import CacheName from './internal/cacheName';
// walkers
import GlobWalker from './walker/glob';
import CustomWalker from './walker/custom';
import * as nodepath from 'path';

export async function startIgnoreFileModeAsync(
  rootDirectory: string,
  ignoreFiles: string[],
  cacheDirectory: string,
  ignoreCache: boolean = false,
): Promise<string[]> {
  const changedFiles = await GlobWalker.matchAsync(rootDirectory, ignoreFiles);
  return await internalStart(rootDirectory, changedFiles, cacheDirectory, ignoreCache);
}

export async function startAllFilesModeAsync(
  rootDirectory: string,
  cacheDirectory: string,
  ignoreCache: boolean = false,
): Promise<string[]> {
  const changedFiles = await CustomWalker(rootDirectory, null, null);
  return await internalStart(rootDirectory, changedFiles, cacheDirectory, ignoreCache);
}

export async function startCustomModeAsync(
  rootDirectory: string,
  cacheDirectory: string,
  ignoreCache: boolean = false,
  fileFilter: ((fileName: string) => boolean) | null = null,
  dirFilter: ((dirName: string) => boolean) | null = null,
): Promise<string[]> {
  const changedFiles = await CustomWalker(rootDirectory, fileFilter, dirFilter);
  return await internalStart(rootDirectory, changedFiles, cacheDirectory, ignoreCache);
}

async function internalStart(
  rootDir: string,
  changedFiles: string[],
  cacheDir: string,
  ignoreCache: boolean = false,
): Promise<string[]> {
  const fullSrcDir = nodepath.resolve(rootDir);
  const fullCacheDir = nodepath.resolve(cacheDir);

  if (ignoreCache) {
    return changedFiles.map((file) => nodepath.relative(fullSrcDir, file));
  }

  return await Promise.all(changedFiles.map(async (absFile) => {
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
    return results.filter((f) => f !== null) as string[];
  });
}
