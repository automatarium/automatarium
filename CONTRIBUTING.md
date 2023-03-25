# Contributing to Automatarium

Automatarium is primarily a student-driven project developed at [RMIT University](https://www.rmit.edu.au/) in Australia, however we appreciate and encourage community contributions in the form of issues or pull requests.

Most of the project architecture and structure is described in detail in the [contributor guide](https://github.com/automatarium/automatarium/wiki/Project-Architecture) section of the wiki. If you find any pages that are out of date or lacking information, please improve them.

## Creating Issues

If you find a bug or have a feature request, you can [create an issue](https://github.com/automatarium/automatarium/issues/new/choose) and describe in detail what is going wrong/what you think could be improved.

## Project Structure

Automatarium is a React project with a Node JS backend (that connects to a MongoDB database). We have two packages for automata simulation and jflap to automatarium file conversion.

## Setup

1. Clone this repository onto your local machine
2. Run `yarn` to install dependencies (don't have yarn? run `npm i -g yarn`)
3. Optionally, set up environment variables in a `.env` file in the backend to connect to a database
4. Run `yarn dev` to start the dev server at [http://localhost:1234](http://localhost:1234)

There are also other yarn commands, for example you can run `yarn dev:frontend` to start the frontend without the backend (useful to test functionality without connecting a database). See `package.json` for all available commands.

## Development

This project is set up using yarn workspaces. To install a new dependency, run `yarn workspace <folder> add <package>`, where `folder` is frontend, backend, @automatarium/simulation, or @automatarium/jflap-translator, and `package` is the package you wish to add.

Before making PR, check your code with `yarn lint`

## Deployment

1. Ensure dependencies are installed by running `yarn`
2. Run `yarn build` to build the packages, backend and frontend
