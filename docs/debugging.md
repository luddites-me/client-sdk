# Debugging

## Table of Contents

- [Debugging](#debugging)
  - [Unit Tests](#unit-tests)
    - [VS Code](#vs-code)

## Unit Tests

Mocha unit tests can be debugged to allow testing the code while in development as well as diagnosing issues with the unit tests themselves.

### VS Code

The following can be added to `.vscode/launch.json` to enable a VS task to launch the unit tests in debug mode.

```json
"configurations": [
    {
        "type": "node",
        "request": "launch",
        "name": "Mocha All",
        "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
        "args": [
            "-r",
            "ts-node/register",
            "--timeout",
            "999999",
            "--colors",
            "${workspaceFolder}/test/**/*Test.ts",
        ],
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen",
        "protocol": "inspector"
    },
...
]
```
