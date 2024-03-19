# Contributing to Automatarium

Automatarium is primarily a student-driven project developed at [RMIT University](https://www.rmit.edu.au/) in Australia, however we appreciate and encourage community contributions in the form of issues or pull requests.

Most of the project architecture and structure is described in detail in the [contributor guide](https://github.com/automatarium/automatarium/wiki/Project-Architecture) section of the wiki. If you find any pages that are out of date or lacking information, please improve them.

## Creating Issues

If you find a bug or have a feature request, you can [create an issue](https://github.com/automatarium/automatarium/issues/new/choose) and describe in detail what is going wrong/what you think could be improved.

## Project Structure

Automatarium is a React project. We have two packages for automata simulation and jflap to automatarium file conversion.

## Setup

1. Clone this repository onto your local machine
2. Run `yarn` to install dependencies (don't have yarn? run `npm i -g yarn`)
3. Run `yarn dev` to start the dev server at [http://localhost:1234](http://localhost:1234)

There are also other yarn commands. See `package.json` for all available commands.

## Development

This project is set up using yarn workspaces. To install a new dependency, run `yarn workspace <folder> add <package>`, where `folder` is frontend, @automatarium/simulation, or @automatarium/jflap-translator, and `package` is the package you wish to add.

Before making PR, check your code with `yarn lint`

## Git Conventions

### Branches
🏠 `main`
Production branch. Do not commit directly to this branch.

⚙️ `dev`
Development branch. Try not to commit directly to this branch

✨ `feat/branch`
Prefix new feature branches with feat. When complete, submit a PR into dev.

🔧 `fix/branch`
When fixing a bug, prefix branches with fix. When complete, submit a PR into dev.

🔮 `refactor/branch`
For refactoring code. When complete, submit a PR into dev.

🔥 `hotfix/branch`
For fixing breaking bugs on the main branch. When finished, submit a PR into main.

🧹 `chore/branch`
For chores like adding type checking, adding README text, fixing typos etc. When finished, submit a PR into dev.

🕰️ `legacy/branch`
To snapshot the codebase before making a major change.

### Pull Requests
> **Warning**
> Make sure you merge into dev not main!

Mention the issue you are closing at the top of your PR like so:
```
Closes #6

[describe your PR...]
```

Make sure the title and body of the PR is descriptive

## Deployment

1. Ensure dependencies are installed by running `yarn`
2. Run `yarn build` to build the packages, backend and frontend
