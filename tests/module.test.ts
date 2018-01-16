const main = require('../..');
import * as fs from 'fs';

test('No exception is thrown', () => {
  expect(typeof main.start).toBe('function');
});

test('Check type definition file', () => {
  expect(fs.statSync('./dist/lib/main.d.ts').isFile()).toBe(true);
});
