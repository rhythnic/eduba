import { type Configuration, DefinePlugin } from 'webpack';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { resolve } from 'node:path';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: {
    index: './src/main/index.ts',
    mneumonicWallet: "./src/lib/hd-wallet/proxy/mneumonic.child-proxy.ts",
    ledgerWallet: "./src/lib/hd-wallet/proxy/ledger.child-proxy.ts"
  },
  output: {
    filename: '[name].js',
  },
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new DefinePlugin({
      DHT_BOOTSTRAP_NODES: process.env.DHT_BOOTSTRAP_NODES,
      APP_DATA_DIRECTORY: process.env.APP_DATA_DIRECTORY
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      "@":  resolve(__dirname, 'src/'),
      "package-json": resolve(__dirname, "package.json")
    }
  },
  externals: {
    'usb': 'usb'
  }
};
