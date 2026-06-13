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
      match: /(\i:\(\)=>(\i).*)function \2/g,
      replacement: (_orig, orig, ident) =>
        `${orig}let ${ident} = require('pluralchum_main').MessageHeaderProxy.bind(this, orig); function orig`,
    },
  },
  {
    find: /isCommandType\(\)[^;]*editedTimestamp\?\./,
    replace: {
      match: /(\i:\(\)=>(\i).*)\2=(\i\.memo)\(/g,
      replacement: (_orig, orig, ident, memo) =>
        `${orig}${ident} = require('pluralchum_main').MessageContentProxy(${memo}, `,
    },
  },
  {
    find: 'discord/actions/MessageActionCreators',
    replace: {
      match: /(\{\i:\(\)=>(\i).*\2=)(\i)/g,
      replacement: (_orig, orig, _ident, wrapped) =>
        `${orig}require('pluralchum_wrap').wrapMessageActionCreators(${wrapped})`,
    },
  },
  {
    find: 'discord/stores/MessageStore',
    replace: {
      match: /getLastEditableMessage/g,
      replacement: `getLastEditableMessage(e) { return require('pluralchum_main').getLastEditableMessage(e); }orig_getLastEditableMessage`,
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
      {
        ext: 'contextMenu',
        id: 'contextMenu',
      },
      {
        id: 'discord/actions/MessageActionCreators',
      },
      {
        id: 'discord/uikit/Flex',
      },
      {
        id: 'discord/modules/modals/Modals',
      },
      {
        id: 'discord/modules/messages/web/Markup.css',
      },
    ],
  },

  wrap: {},
};
