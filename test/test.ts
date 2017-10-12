import * as main from '../lib/main';
import * as tmp from 'tmp';
import * as assert from 'assert';
import * as nodepath from 'path';
const copyDir = require('copy-dir') as any;

const SORTED_FILES = ['a.md', 'dir/b.md'].sort();

function newTmpDir(): string {
  return tmp.dirSync().name;
}

let tmpDir = newTmpDir();
let dataDir = nodepath.join(__dirname, 'data');

describe('Main', () => {
  copyDir.sync(dataDir, tmpDir);
  console.log(`copy: ${dataDir} to ${tmpDir}`);
  const cacheDir = newTmpDir();

  it('All files should be considered new', async () => {
    const files = await main.start(tmpDir, '/**/*.md', cacheDir);
    assert.deepEqual(files.sort(), SORTED_FILES);
  });

});
