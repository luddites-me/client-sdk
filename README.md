# Test README

[![CircleCI](https://circleci.com/gh/ns8inc/protect-sdk-client.svg?style=svg&circle-token=91f2dda1fe4873ce83070a4dfa42edf0d3f20328)](https://app.circleci.com/pipelines/github/ns8inc/protect-sdk-client)

## Table of Contents

- [Test README](#test-readme)
- [Getting Started](#getting-started)
  - [Running Tests](#running-tests)
  - [`package.json` scripts](#packagejson-scripts)
  - [License](#license)

# Getting Started

To get started, take a look at the documentation listed below:

- [Protect Client Documentation](docs/client.md)
- [Debugging](docs/debugging.md)
- [Installation](docs/installation.md)

### Running Tests

`yarn test`

### `package.json` scripts

- `yarn build`: Builds and bundles the project.
- `yarn build:dev`: Build the project with source maps for easier development.
- `yarn build:prod`: Builds and minifies the project for distribution.
- `yarn bundle`: Bundles the project.
- `yarn clean`: Removes build artifacts.
- `yarn docs`: Generates documentation from typescript code.
- `yarn docs:standardize`: Updates the project's documentation according to the markdown standard.
- `yarn generate:exports`: Exports SDK functions to a top-level index.ts file in the src directory.
- `yarn lint`: Lints the codebase.
- `yarn sortJson`: Perform aesthetic operations to make the project files easier to navigate and read.
- `yarn test`: Runs tests and calculates test coverage.

## License

See [License](./LICENSE)
© [ns8inc](https://ns8.com)
