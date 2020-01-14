/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageJSONPath = join(__dirname, '..', 'package.json');
const readmePath = join(__dirname, '..', 'README.md');

type Docs = any;

interface MainArgs {
  targetHeader: string;
  readme: string;
  docs: Docs;
}

interface PatchData {
  readme: string;
  targetHeader: string;
  updates: string;
}

interface ScriptDescription {
  script: string;
  description: string;
}

function format({ script, description }: ScriptDescription): string {
  return `\`npm ${script}\`\n- ${description}\n`;
}

function formatScriptsDocumentation({ docs }: Docs): string {
  return Object.keys(docs)
    .map((script) => {
      const { description } = docs[script];
      return format({ script, description });
    })
    .join('\n');
}

function replaceReadmeSection({ readme, targetHeader, updates }: PatchData): string {
  const lines = readme.split('\n');
  const linesToInsert = [targetHeader, '\n', ...updates.split('\n')];
  const targetStart = lines.findIndex((line) => line === targetHeader);

  // case 1: scripts section docs doesn't exist
  if (targetStart < 0) {
    return `${readme}\n${linesToInsert.join('\n')}\n`;
  }

  const nextSectionOffset = lines.slice(targetStart + 1).findIndex((line) => /^#{1,3} /.test(line));

  // case two: scripts is last section
  if (nextSectionOffset < 0) {
    return [...lines.slice(0, targetStart), ...linesToInsert, '\n'].join('\n');
  }

  const restIndex = targetStart + 1 + nextSectionOffset;

  // case 3: scripts documentation exists between other sibling or parent sections
  return [...lines.slice(0, targetStart), ...linesToInsert, '\n', ...lines.slice(restIndex)].join('\n');
}

function main({ targetHeader, readme, docs }: MainArgs): string {
  const updates = formatScriptsDocumentation({ docs });
  return replaceReadmeSection({ targetHeader, readme, updates });
}

export { main, format, replaceReadmeSection, formatScriptsDocumentation };

/* MAIN SCRIPT EXECUTION */

const { scriptsDocumentation } = JSON.parse(readFileSync(packageJSONPath, 'utf8'));
const readme = readFileSync(readmePath, 'utf8');
const updatedReadme = main({
  readme,
  docs: scriptsDocumentation,
  targetHeader: '### `package.json` scripts',
});
writeFileSync(join(__dirname, '..', 'README.md'), updatedReadme);
