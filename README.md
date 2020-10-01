# Test README

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Environment Variables](#environment-variables)
  - [Running Tests](#running-tests)
  - [`package.json` scripts](#packagejson-scripts)
- [License](#license)

# Getting Started

To get started, take a look at the documentation listed below:

- docs
  - [Protect Client Documentation](docs/client.md)
  - [Debugging](docs/debugging.md)
  - [Installation](docs/installation.md)
  - [API Report File for "@luddites-me/protect-sdk-client"](docs/project-api.md)

## Environment Variables

- `NODE_ENV`: Environment name. Options are: dev, test and prod. Default: dev
  - Default Value: "undefined"

### Running Tests

`yarn test`

### `package.json` scripts

- `yarn build`: Assembles `src` code into a single, minified JS module with type definitions. Exports `build` scripts into a build folder.
- `yarn bundle`: Runs WebPack on the `src` code.
- `yarn clean`: Purges all temporary folders
- `yarn count`: Counts lines of source code.
- `yarn docs:all`: Standardizes markdown and generates the API metadata.
- `yarn docs:api`: Creates a `project-api` Markdown in docs and an `index.d.ts` file in dist.
- `yarn docs:publish`: Generates end-to-end documentation for the entire project and publishes it to the `gh-pages` branch.
- `yarn docs:standardize`: Creates or updates a new readme with a standard set of readme sections, including a toc, yarn script documention, links to repo documentation files and an LUDDITES license
- `yarn generate:exports`: Generates index.ts files for all exports recursively in the 'src' folder
- `yarn lint`: Lints the codebase and the documentation
- `yarn lint:fix`: Lints the codebase and fixes auto-correctable errors. Runs prettier on the code.
- `yarn sortJson`: Performs aesthetic operations to make the project files easier to navigate and read
- `yarn test`: Builds and then runs tests and calculates test coverage. This should be run by CI.
- `yarn test:coverage`: Runs tests, calculates test coverage in debug mode.
- `yarn test:debug`: Runs tests with the debugger attached.
- `yarn test:only`: Runs tests and calculates test coverage. This should be run for local development.

## License

See [License](./LICENSE)
© [Luddites](https://github.com/luddites-me)
