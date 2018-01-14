import * as main from '../lib/main';
import * as tmp from 'tmp';
import * as assert from 'assert';
import * as nodepath from 'path';
import { promisify } from 'util';
import * as fs from 'fs';
const copyDir = require('copy-dir') as any;

const IGNORE_FILES = ['ignoreFile.txt'];
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

const dataDir = nodepath.join(__dirname, 'data');

function testWithTmpDir(tmpDir: string, title: string) {
  describe(title, () => {
    copyDir.sync(dataDir, tmpDir);
    const cacheDir = newTmpDir();
    // tslint:disable-next-line: no-console
    console.log(`Data  dir: ${tmpDir}`);
    // tslint:disable-next-line: no-console
    console.log(`Cache dir: ${cacheDir}`);

    it('All files should be considered new', async () => {
      const files = await main.start(tmpDir, IGNORE_FILES, cacheDir);
      assert.deepEqual(files.sort(), SORTED_FILES);
    });
    it('Nothing new', async () => {
      const files = await main.start(tmpDir, IGNORE_FILES, cacheDir);
      assert.deepEqual(files, []);
    });
    it('Touch a file', async () => {
      await delayAsync(1100);
      await touchAsync(nodepath.join(tmpDir, 'dir/b.md'));
      const files = await main.start(tmpDir, IGNORE_FILES, cacheDir);
      assert.deepEqual(files.sort(), ['dir/b.md'].sort());
    }).timeout(1500);
    it('Touch an irrelevant file', async () => {
      await delayAsync(1100);
      await touchAsync(nodepath.join(tmpDir, 'a.txt'));
      const files = await main.start(tmpDir, IGNORE_FILES, cacheDir);
      assert.deepEqual(files, []);
    }).timeout(1500);
    it('Create files', async () => {
      await delayAsync(1100);
      await touchAsync(nodepath.join(tmpDir, 'a.txt'));
      await touchAsync(nodepath.join(tmpDir, 'new1.txt'));
      await touchAsync(nodepath.join(tmpDir, 'new1.md'));
      await touchAsync(nodepath.join(tmpDir, 'new2.md'));
      const files = await main.start(tmpDir, IGNORE_FILES, cacheDir);
      assert.deepEqual(files.sort(), ['new1.md', 'new2.md']);
    }).timeout(1500);
    it('Ignore cache', async () => {
      const files = await main.start(tmpDir, IGNORE_FILES, cacheDir, true);
      assert.deepEqual(files.sort(), SORTED_FILES_NEW);
    });
  });
}

testWithTmpDir(nodepath.relative('.', newTmpDir()), 'Relative root path');
testWithTmpDir(newTmpDir(), 'Absolute root path');
