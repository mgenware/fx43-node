# fx43-node

[![Build Status](https://travis-ci.org/mgenware/fx43.svg?branch=master)](http://travis-ci.org/mgenware/fx43)
[![npm version](https://badge.fury.io/js/fx43.svg)](https://badge.fury.io/js/fx43)
[![Node.js Version](http://img.shields.io/node/v/fx43.svg)](https://nodejs.org/en/)

Detecting changed files via caching file modification time

## Installation
```sh
# npm
npm install --save fx43

# yarn
yarn add fx43
```

Run tests:
```sh
# npm
npm test

# yarn
yarn test
```

# Usage

## API
```javascript
const fx43 = require('fx43');

fx43.start(srcDir: string, glob: string, cacheDir: string, ignoreCache?: boolean): Promise<string[]>;
```

## Example
Suppose you have some files in a directory named `data`:
```
- data/
  index.html
  main.js
  style.css
  lib/
    lib.js
```

You need to process all changed `.js` files.
```javascript
// Node.js 8+
const fx43 = require('fx43');

async function printChangedFiles() {
  const files = await fx43.start(
    './data',       // source dir: data
    '**/*.js',      // selected files: all .js
    './.cache');    // cache dir: .cache (all selected files' modification time will be saved inside this dir)
  console.log(`${files.length} file(s) changed.\n${files}`);
}

(async () => {
  await printChangedFiles();
})();
```

```sh
# run the program
node example.js
# output
2 file(s) changed.
main.js
lib/lib.js

# run the program
node example.js
# output
0 file(s) changed.

# modify and create some files
touch ./data/lib/lib.js
touch ./data/new.js
# run the program
node example.js
# output
2 file(s) changed.
lib/lib.js
new.js

# modify an irrelevant file
touch ./data/style.css
# run the program
node example.js
# output
0 file(s) changed.

```
