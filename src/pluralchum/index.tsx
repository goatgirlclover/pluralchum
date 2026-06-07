import { ExtensionWebExports } from '@moonlight-mod/types';

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports['patches'] = [
  {
    find: /displayNameStyles!=null&&.*guildId/g,
    replace: {
      match: /let (\i)=function/,
      replacement: (_orig, ident) =>
        `let ${ident} = require('pluralchum_main').MessageProxy.bind(this, orig); function orig`,
    },
  },
  {
    find: /textDecorationColor:\i\?\.primaryColor/g,
    replace: {
      match: /({\i:\(\)=>(\i).*)function \2/g,
      replacement: (_orig, orig, ident) =>
        `${orig}let ${ident} = require('pluralchum_main').MessageHeaderProxy.bind(this, orig); function orig`,
    },
  },
];

// https://moonlight-mod.github.io/ext-dev/webpack/#webpack-module-insertion
export const webpackModules: ExtensionWebExports['webpackModules'] = {
  entrypoint: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'main',
      },
    ],
    entrypoint: true,
  },

  main: {
    dependencies: [
      {
        id: 'react',
      },
      {
        ext: 'common',
        id: 'stores',
      },
    ],
  },
};
