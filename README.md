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

You should be able to access these publishers. Click the "+" sign to open a new tab and enter one of these links in the text field.

- bsk483aq99zputxmmguj3oxjtj79umq66xe9zixd1s8qrhhta34o/articles/1701224812473
- 1huqogtdh3mm9wh7f4nehcbzx8indrtijo4z7fkorrgtrf6w1n8o/articles/1701224891736

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

# Run the electron app as peer 1
gulp peer1

# Run the electron app as peer 2
gulp peer2
```

## Warning

This application is in beta. Do not trust it to be a reliable store of data. Keep a copy of all the articles and files that you publish, so that if you need to, you can easily restore your data. Do not use Eduba for sensitive information.

[holepunch]: https://holepunch.to
[electron]: https://electronjs.org
