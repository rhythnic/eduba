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
        width="300px"
        height="auto"
        src="https://github.com/rhythnic/eduba/assets/8162640/57c04d5d-f65a-4e45-931a-36ed5ea35cff">
</picture>

Eduba is a protocol for publishing linked articles peer-to-peer on the [Holepunch platform][holepunch].

In this repository is the initial proof of concept client. It is a desktop application built on [Electron][electron].

## Run

```bash
yarn
touch .env
yarn start
```
Files are saved in the default application data directory for your OS.

You should be able to access these publishers. Click the "+" sign to open a new tab and enter one of these links in the text field.

- bsk483aq99zputxmmguj3oxjtj79umq66xe9zixd1s8qrhhta34o/articles/1701224812473
- 1huqogtdh3mm9wh7f4nehcbzx8indrtijo4z7fkorrgtrf6w1n8o/articles/1701224891736


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

This application is in beta. Do not trust it to be a reliable store of data. Keep a copy of all the articles and files that you publish, so that if you need to, you can easily restore your data. Do not use Eduba for sensitive information.

[holepunch]: https://holepunch.to
[electron]: https://electronjs.org
[electron_forge]: https://www.electronforge.io/
[hyperswarm]: https://docs.holepunch.to/building-blocks/hyperswarm
