Eduba is a protocol for publishing linked articles peer-to-peer on the [Holepunch platform][holepunch].

In this repository is the initial proof of concept client. It is a desktop application built on [Electron][electron].

## Install

```bash
yarn
```

## Run without packaging

```bash
yarn build
yarn start
```

## Create Installer for Your OS

Look for a package installer in the `dist` folder.

```bash
yarn build
yarn dist
```

## Develop

```bash
npm install -g gulp-cli
```

Run these commands in separate processes

```bash
# Run Preact app in development mode
gulp renderer

# Start a local DHT testnet
gulp dht

# Run the electron app as pper 1
gulp peer1

# Run the electron app as peer 2
gulp peer2
```

## Warning

This application is in beta. Do not trust it to be a reliable store of data. Keep a copy of all the articles and files that you publish, so that if you need to, you can easily restore your data. Do not use Eduba for sensitive information.

[holepunch]: https://holepunch.to
[electron]: https://electronjs.org
