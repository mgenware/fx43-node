# fx43-node

[![MEAN Module](https://img.shields.io/badge/MEAN%20Module-TypeScript-blue.svg)](https://github.com/mgenware/MEAN-Module)
[![Build Status](https://travis-ci.org/mgenware/fx43-node.svg?branch=master)](http://travis-ci.org/mgenware/fx43-node)
[![npm version](https://badge.fury.io/js/fx43.svg)](https://badge.fury.io/js/fx43)
[![Node.js Version](http://img.shields.io/node/v/fx43.svg)](https://nodejs.org/en/)

Detecting changed files via caching file modification time.

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
Fx43 offers 3 ways to track files:
* All files mode: all files are tracked.
* Ignore file mode: like `.gitignore`, tracks files in respect to nested ignore files.
* Custom mode: tracks files filtered by custom JavaScript functions.

### All files mode
```js
import { startAllFilesModeAsync } from 'fx43-node';
// ES5: const startAllFilesModeAsync = require('fx43-node').startAllFilesModeAsync;

startAllFilesModeAsync(
  rootDirectory: string,
  cacheDirectory: string,
  ignoreCache: boolean = false,
): Promise<string[]>;
```

### Ignore file mode
```js
import { startIgnoreFileModeAsync } from 'fx43-node';
// ES5: const startIgnoreFileModeAsync = require('fx43-node').startIgnoreFileModeAsync;

startIgnoreFileModeAsync(
  rootDirectory: string,
  ignoreFiles: string[],   // e.g. ['.myignore', '.gitignore']
  cacheDirectory: string,
  ignoreCache: boolean = false,
): Promise<string[]>;
```

### Custom mode
```js
import { startCustomModeAsync } from 'fx43-node';
// ES5: const startCustomModeAsync = require('fx43-node').startCustomModeAsync;

startCustomModeAsync(
  rootDirectory: string,
  cacheDirectory: string,
  ignoreCache: boolean = false,
  // use this to filter files
  fileFilter: ((fileName: string) => boolean) | null = null,
  // use this to filter directories
  dirFilter: ((dirName: string) => boolean) | null = null,
): Promise<string[]>;
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

You need to process all changed `.js` files. In this case, you can use ignore file mode. Define an ignore file like `.gitignore`, for example, `.myignore` with following contents:
```
# .myignore
# put this file to the root folder of project

# ignore html and css files
*.html
*.css
```

Then call fx43 APIs like this:
```javascript
import { startIgnoreFileModeAsync } from 'fx43-node';

async function printChangedFiles() {
  const files = await startIgnoreFileModeAsync('./data', ['.myignore'], './.cache');
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

For more examples, see [examples](https://github.com/mgenware/fx43-node/tree/master/examples).