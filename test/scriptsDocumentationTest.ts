import { expect } from 'chai';
import 'mocha';

import { format, main } from '../build/scriptsDocumentation';

const removeBlankLines = (content: string): string => {
  return content
    .split('\n')
    .filter(Boolean)
    .join('\n');
};

/*
 * Test Cases:
 *
 * - readme has no build script information at all
 * - readme has build script info as the last section
 * - readme has build script info as a middle section
 */

// no pre-existing build script info in readme
const README_NO_SCRIPT_DOCS_ACTUAL = `
# Test README
This is a test readme.
# Getting Started
Clone the repo and run yarn install
`;

const README_NO_SCRIPT_DOCS_EXPECTED = `
# Test README
This is a test readme.
# Getting Started
Clone the repo and run yarn install
### \`package.json\` scripts
\`npm script1\`
- script 1 description
\`npm script2\`
- script 2 description
\`npm script3\`
- script 3 description
\`npm script4\`
- script 4 description
`;

// pre-existing build script info, at the end
const README_SCRIPT_AT_END_DOCS_ACTUAL = `
# Test README
This is a test readme.
# Getting Started
Clone the repo and run yarn install
### \`package.json\` scripts
\`npm old-script1\`
- old-script1 description
\`npm old-script2\`
- old-script2 description
\`npm old-script3\`
- old-script3 description
\`npm old-script4\`
- old-script4 description
`;

const README_SCRIPT_AT_END_DOCS_EXPECTED = `
# Test README
This is a test readme.
# Getting Started
Clone the repo and run yarn install
### \`package.json\` scripts
\`npm script1\`
- script 1 description
\`npm script2\`
- script 2 description
\`npm script3\`
- script 3 description
\`npm script4\`
- script 4 description
`;

// pre-existing build script info, at the end
const README_SCRIPT_IN_MIDDLE_DOCS_ACTUAL = `
# Test README
This is a test readme.
# Getting Started
Clone the repo and run yarn install
### \`package.json\` scripts
\`npm outdated-script1\`
- outdated-script1 description
\`npm outdated-script2\`
- outdated-script2 description
\`npm outdated-script3\`
- outdated-script3 description
\`npm outdated-script4\`
- outdated-script4 description
### extra section
this is an extra section
`;

const README_SCRIPT_IN_MIDDLE_DOCS_EXPECTED = `
# Test README
This is a test readme.
# Getting Started
Clone the repo and run yarn install
### \`package.json\` scripts
\`npm script1\`
- script 1 description
\`npm script2\`
- script 2 description
\`npm script3\`
- script 3 description
\`npm script4\`
- script 4 description
### extra section
this is an extra section
`;

const parsedPackageJson = {
  scripts: {
    script1: 'test',
    script2: 'test',
    script3: 'test',
    script4: 'test',
  },
  scriptsDocumentation: {
    script1: {
      dev: true,
      description: 'script 1 description',
    },
    script2: {
      dev: true,
      description: 'script 2 description',
    },
    script3: {
      dev: true,
      description: 'script 3 description',
    },
    script4: {
      dev: true,
      description: 'script 4 description',
    },
  },
};

const { scriptsDocumentation: docs } = parsedPackageJson;

describe('SYNC-BUILD-SCRIPTS-WITH-README: properly formats a build-script README.md entry', () => {
  it('turns script object into a formatted readme string ', () => {
    const actual = format({
      script: 'testCommand',
      description: 'This is a test command',
    }).trim();
    const expected = '`npm testCommand`\n- This is a test command';
    expect(actual.trim()).to.equal(expected);
  });
});

describe('SYNC-BUILD-SCRIPTS-WITH-README: script updates README.md', () => {
  it('concatenates build script info to the end of readme when there is no build script section.', () => {
    const expected = removeBlankLines(README_NO_SCRIPT_DOCS_EXPECTED);
    const actual = removeBlankLines(
      main({
        readme: README_NO_SCRIPT_DOCS_ACTUAL,
        docs,
        targetHeader: '### `package.json` scripts',
      }),
    );

    expect(actual).to.equal(expected);
  });

  it('replaces build scripts that exist at the end of the document', () => {
    const expected = removeBlankLines(README_SCRIPT_AT_END_DOCS_EXPECTED);
    const actual = removeBlankLines(
      main({
        docs,
        targetHeader: '### `package.json` scripts',
        readme: README_SCRIPT_AT_END_DOCS_ACTUAL,
      }),
    );

    expect(actual).to.equal(expected);
  });

  it('simply adds build scripts info to the readme when there is no build script section.', () => {
    const expected = removeBlankLines(README_SCRIPT_IN_MIDDLE_DOCS_EXPECTED);
    const actual = removeBlankLines(
      main({
        docs,
        targetHeader: '### `package.json` scripts',
        readme: README_SCRIPT_IN_MIDDLE_DOCS_ACTUAL,
      }),
    );

    expect(actual).to.equal(expected);
  });
});
