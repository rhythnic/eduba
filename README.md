<picture>
    <source
        media="(prefers-color-scheme: light)"
        srcset="https://github.com/rhythnic/eduba/assets/8162640/57c04d5d-f65a-4e45-931a-36ed5ea35cff"
    >
    <source
        media="(prefers-color-scheme: dark)"
        srcset="https://github.com/rhythnic/eduba/assets/8162640/cbe7b56e-31ba-49a2-a28a-7d25e1d8a586"
    >
    <img
        alt="Eduba Logo"
        width="500px"
        src="https://github.com/rhythnic/eduba/assets/8162640/57c04d5d-f65a-4e45-931a-36ed5ea35cff">
</picture>

## Update - Repo moved

This project has moved to [here](https://github.com/eduba-protocol/eduba-desktop)

## About

Eduba is a protocol for publishing linked articles peer-to-peer on the [Holepunch platform][holepunch].

In this repository is the initial proof of concept client. It is a desktop application built on [Electron][electron].

## Use

Download and run the package for your OS from the [releases page](https://github.com/rhythnic/eduba/releases).

### Sign In
Signing in allows you to publish articles, save bookmarks, and subscribe to publishers.  Eduba uses your login credentials to generate the identifiers of the publishers that you create.  To ensure that your publishers' identifiers are unique, Eduba uses recovery phrases and hardware wallets for signing in, as is common in cryptocurrency.  Eduba supports Ethereum and Bitcoin addresses, where each address is a unique user.  You are not required to be familiar with cryptocurrency to use Eduba.  Just click on the icon for generating a phrase, save it as you would a password, and use it to sign in.

## Develop

```bash
yarn
touch .env
yarn start
```
Files are saved in the default application data directory for your OS.


## Configure
Edit `.env` as desired.

```bash
APP_DATA_DIRECTORY="ABSOLUTE_PATH_TO_THIS_REPO/data"
LOG_LEVEL="debug"
```

### Local Testnet
You can run a local [Hyperswarm][hyperswarm] testnet for development.

```bash
node scripts/testnet.js
```

The script will output the environment variable `DHT_BOOTSTRAP_NODES`.
Add it to your `.env`

## Electron Forge
See the [Electron Forge][electron_forge] documentation for instructions on building native OS packages.

## Warning

This application is in alpha. Do not trust it to be a reliable store of data. Keep a copy of all the articles and files that you publish, so that if you need to, you can easily restore your data. Do not use Eduba for sensitive information.

[holepunch]: https://holepunch.to
[electron]: https://electronjs.org
[electron_forge]: https://www.electronforge.io/
[hyperswarm]: https://docs.holepunch.to/building-blocks/hyperswarm
[farcaster]: https://www.farcaster.xyz/
