# 🌏 Automatarium

> A place for automata

Automatarium is a modern take on the useful [JFLAP](https://www.jflap.org/), but designed with a modern user interface and quality-of-life features that were lacking in JFLAP. Currently Automatarium supports finite automata, with room to add additional functionality such as push-down automata and Turing machines in the future.

![Screenshot of Automatarium editor](./screenshot.png)

## Contributors

Automatarium is built by RMIT students with the original members being

- [Max Reid](https://github.com/Prydeton)
- [Thomas Dib](https://github.com/tdib)
- [Ewan Breakey](https://github.com/giraugh)
- [Benji Grant](https://github.com/GRA0007)
- [Tim Tran](https://github.com/spacediscotqtt)

It was then expanded on by more capstone groups

<details>
    <summary>Group 2</summary>
    - [Conor Christensen](https://github.com/ConorChristensen-RMIT)
    - [Jessani Linsangan](https://github.com/s3844703)
    - [Lachlan Blennerhassett](https://github.com/Canni6)
    - [Tomas Haddad](https://github.com/tomashaddad)
    - [Oliver Hale](https://github.com/s3781403)
</details>

<details>
    <summary>Group 3</summary>
    - [Ope Abbas](https://github.com/OpeAbbas)
    - [Sidhra Fernando-Plant](https://github.com/SidhraFernando-Plant)
    - [Jake Leahy](https://github.com/ire4ever1190)
    - [Aung Pyae Sone](https://github.com/eddie7788)
    - [Lachlan Van Der Klift](https://github.com/LvandoApps)
</details>

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

## License

Automatarium is licensed under MIT
