# Test README

[![Concourse-CI](https://concourse.ns8-infrastructure.com/api/v1/teams/main/pipelines/protect-js-sdk/jobs/test/badge)](https://concourse.ns8-infrastructure.com/teams/main/pipelines/protect-js-sdk)

# Getting Started
Clone the repo and run `yarn` to install.


### Running Tests
`yarn test`

### `package.json` scripts

`yarn beautify`
- Perform aesthetic operations to make the project files easier to navigate and read.

`yarn build`
- Builds and bundles the project.

`yarn build:dev`
- Build the project with source maps for easier development.

`yarn build:prod`
- Builds and minifies the project for distribution.

`yarn bundle`
- Bundles the project.

`yarn clean`
- Removes build artifacts.

`yarn docs`
- Generates documentation from typescript code.

`yarn docs:sync-build-scripts`
- Updates the project README.md with the scriptsDocumentation information from package.json.

`yarn generate:exports`
- Exports SDK functions to a top-level index.ts file in the src directory.

`yarn lint`
- Lints the codebase.

`yarn test`
- Runs tests and calculates test coverage.

