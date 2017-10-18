// Node.js 8+
const fx43 = require('..');

async function printChangedFiles() {
  const files = await fx43.start('./data', '**/*.html', './.cache');
  console.log(`${files.length} file(s) changed.\n${files}`);
}

(async () => {
  await printChangedFiles();
})();
