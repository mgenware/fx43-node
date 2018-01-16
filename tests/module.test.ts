const main = require('../..');
import * as fs from 'fs';

test('Check members', () => {
  expect(typeof main.startIgnoreFileModeAsync).toBe('function');
  expect(typeof main.startCustomModeAsync).toBe('function');
});

test('Check type definition file', () => {
  expect(fs.statSync('./dist/lib/main.d.ts').isFile()).toBe(true);
});
