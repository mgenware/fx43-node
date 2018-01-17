// Node.js 8+
const startIgnoreFileModeAsync = require('..').startIgnoreFileModeAsync;

async function printChangedFiles() {
  const files = await startIgnoreFileModeAsync('./data', ['.myignore'], './.cache');
  console.log(`${files.length} file(s) changed.\n${files}`);
}

(async () => {
  await printChangedFiles();
})();
