Eduba is a protocol for publishing linked articles peer-to-peer on the [Holepunch platform][holepunch].

In this repository is the initial proof of concept client. It is a desktop application built on [Electron][electron].

## Install

```bash
yarn
```

## Build for your OS

Run these commands then look in the dist folder for a file that can be installed on your OS.

```bash
yarn build
yarn dist
```

## Develop

Install gulp-cli

```bash
npm install -g gulp-cli
```

Run these commands in separate processes

```bash
gulp renderer
gulp dht
gulp peer1
```

## Warning

This application is in beta. Do not trust it to be a reliable store of data. Keep a copy of all the articles and files that you publish, so that if you need to, you can easily restore your data. Do not use Eduba for sensitive information.

[holepunch]: holepunch.to
[electron]: electronjs.org
