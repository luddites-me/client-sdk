# Debugging

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

### Puppeteer

Debugging puppeteer tests is possible but involves more steps as the test execution context is split between the Mocha code that is running in Node vs the page.evaluate code which is executing in the Chromium browser. In order to effectly debug:

1. Ensure that the browser is instantiated with `headless` turned off.

1. Ensure a breakpoint is set in the Mocha test (alternatively use a `debugger`). This is essential to allow debugging the code executed inside the browser.

1. Ensure a `debugger` statement is set inside the `page.evaluate` call so that the browser will break correctly.
