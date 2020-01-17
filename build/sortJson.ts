/* eslint-disable no-console */
import glob from 'glob';
import { readFileSync, writeFileSync } from 'fs';

const sortedJson = require('sorted-json');

// Sort all the JSON files to improve readability and reduce conflicts
const globOptions = {
  dot: true,
  ignore: ['**/node_modules/**', '.vscode/**'],
  realPath: true,
};

glob('**/*.json', globOptions, (er, files: string[]) => {
  if (er) {
    console.error(er);
  }
  files.forEach((fileName) => {
    try {
      const file = readFileSync(fileName, 'utf-8');
      const json = JSON.parse(file);
      const sorted = sortedJson.sortify(JSON.stringify(json, null, 2));
      writeFileSync(fileName, sorted);
      console.info(`Alpha-sorted ${fileName} JSON file`);
    } catch (err) {
      console.error(`${fileName}: failed`);
      console.error(err);
    }
  });
});
