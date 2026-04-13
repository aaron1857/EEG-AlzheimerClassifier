import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);



export default {
  packagerConfig: {
    asar: {
      unpack: '.output/**/*'
    },
    extraResource: [
      path.join(dirname, '.output')
    ],
    name: 'Wavethinker',
    executableName: 'Wavethinker',
    ignore: [
      /^\/\.git$/,
      /^\/\.gitignore$/,
      /^\/node_modules$/,
      /^\/\.nuxt$/,
      /^\/integrated_eeg_dataset\.npz$/,
      /^\/test\.ipynb$/,
      /^\/README\.md$/,
      /^\/LICENSE$/,
      /^\/pnpm-lock\.yaml$/,
      /^\/tsconfig\.json$/,
      /^\/pnpm-workspace\.yaml$/,
      /^\/dist$/,
      /^\/public$/,
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      platforms: ['win32'],
      config: {
        exe: "Wavethinker",
        name: "Wavethinker"
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {},
    },
    {
      name: '@reforged/maker-appimage',
      platforms: ['linux'],
      config: {
        options: {
          name: 'Wavethinker',
          bin: 'Wavethinker'
        }
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux', 'darwin', 'win32'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: false,
      [FuseV1Options.OnlyLoadAppFromAsar]: false,
    }),
  ],
};
