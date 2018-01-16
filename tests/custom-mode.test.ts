import * as main from '../lib/main';
import * as tmp from 'tmp';
import * as nodepath from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
const copyDir = require('copy-dir') as any;

const SORTED_FILES = ['a.md', 'dir/b.md'].sort();
const SORTED_FILES_NEW = ['a.md', 'dir/b.md', 'new1.md', 'new2.md'].sort();
const writeFileAsync = promisify(fs.writeFile);

function newTmpDir(): string {
  return tmp.dirSync().name;
}
function delayAsync(t: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}
async function touchAsync(path: string) {
  await writeFileAsync(path, ' ');
}

const dataDir = nodepath.join(__dirname, 'data/custom-mode');

function testWithTmpDir(tmpDir: string, cacheDir: string, title: string) {
  copyDir.sync(dataDir, tmpDir);
  // tslint:disable-next-line: no-console
  console.log(`Data  dir: ${tmpDir}`);
  // tslint:disable-next-line: no-console
  console.log(`Cache dir: ${cacheDir}`);

  async function startAsync(ignoreCache: boolean = false): Promise<string[]> {
    return await main.startCustomModeAsync(tmpDir, cacheDir, ignoreCache, (file) => {
      // ignore all .txt files
      return nodepath.extname(file).toLowerCase() !== '.txt';
    });
  }

  describe(title, () => {
    test('All files should be considered new', async () => {
      const files = await startAsync();
      expect(files.sort()).toEqual(SORTED_FILES);
    });
    test('Nothing new', async () => {
      const files = await startAsync();
      expect(files).toEqual([]);
    });
    test('Touch a file', async () => {
      await delayAsync(1100);
      await touchAsync(nodepath.join(tmpDir, 'dir/b.md'));
      const files = await startAsync();
      expect(files.sort()).toEqual(['dir/b.md'].sort());
    });
    test('Touch an irrelevant file', async () => {
      await delayAsync(1100);
      await touchAsync(nodepath.join(tmpDir, 'a.txt'));
      const files = await startAsync();
      expect(files).toEqual([]);
    });
    test('Create files', async () => {
      await delayAsync(1100);
      await touchAsync(nodepath.join(tmpDir, 'a.txt'));
      await touchAsync(nodepath.join(tmpDir, 'new1.txt'));
      await touchAsync(nodepath.join(tmpDir, 'new1.md'));
      await touchAsync(nodepath.join(tmpDir, 'new2.md'));
      const files = await startAsync();
      expect(files.sort()).toEqual(['new1.md', 'new2.md']);
    });
    test('Ignore cache', async () => {
      const files = await startAsync(true);
      expect(files.sort()).toEqual(SORTED_FILES_NEW);
    });
  });
}

testWithTmpDir(nodepath.relative('.', newTmpDir()), nodepath.relative('.', newTmpDir()), 'Relative root path');
testWithTmpDir(newTmpDir(), newTmpDir(), 'Absolute root path');
