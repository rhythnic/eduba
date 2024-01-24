import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import MakerAppImage from "@reforged/maker-appimage";
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import MakerDMG from "@electron-forge/maker-dmg";
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './images/icon' // no file extension required
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      // iconUrl: 'https://url/to/icon.ico',
      setupIcon: './images/icon.ico'
    }),
    new MakerZIP({}, ['linux']),
    new MakerRpm({
      options: {
        icon: './images/icon.png'
      }
    }),
    new MakerDeb({
      options: {
        icon: './images/icon.png'
      }
    }),
    new MakerAppImage({
        options: {
          icon: './images/icon.png'
        }
    }),
    new MakerDMG({})
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
