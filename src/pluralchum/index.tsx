import { ExtensionWebExports } from '@moonlight-mod/types';

// https://moonlight-mod.github.io/ext-dev/webpack/#patching
export const patches: ExtensionWebExports['patches'] = [
  {
    find: /"User Settings",/g,
    replace: {
      match: /"User Settings",/g,
      replacement: '"hacked by pluralchum lol",',
    },
  },
  {
    find: /displayNameStyles!=null&&.*guildId/g,
    replace: {
      match: /(\i):\(\)=>(\i)/,
      replacement: (_orig, exp, Message) =>
        `${exp}: () => props => require('pluralchum_MessageProxy').default({message: props?.childrenMessageContent?.props?.children?.props?.message, messageNode: ${Message}(props)})`,
    },
  },
  {
    find: /textDecorationColor:\i\?\.primaryColor/g,
    replace: {
      match: /{(\i):\(\)=>(\i)/,
      replacement: (_orig, exp, MessageHeader) =>
        `{${exp}: () => props => require('pluralchum_MessageHeaderProxy').default({messageHeader: ${MessageHeader}(props), message: props?.message, guildId: props?.channel?.guild_id, onClickUsername: props?.onClick})`,
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
        ext: 'pluralchum',
        id: 'data',
      },
      {
        ext: 'pluralchum',
        id: 'utility',
      },
    ],
  },

  utility: {
    dependencies: [
      {
        id: 'react',
      },
    ],
  },

  profiles: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'utility',
      },
      {
        id: 'react',
      },
    ],
  },

  data: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'utility',
      },
      {
        ext: 'pluralchum',
        id: 'profiles',
      },
    ],
  },

  contrast: {},

  MessageProxy: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'utility',
      },
      {
        ext: 'pluralchum',
        id: 'profiles',
      },
      {
        id: 'react',
      },
    ],
  },

  MessageHeaderProxy: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'utility',
      },
      {
        ext: 'pluralchum',
        id: 'profiles',
      },
      {
        id: 'react',
      },
    ],
  },

  ThreeDots: {
    dependencies: [
      {
        id: 'react',
      },
    ],
  },

  HeaderPKBadge: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'ThreeDots',
      },
      {
        ext: 'pluralchum',
        id: 'profiles',
      },
      {
        id: 'react',
      },
    ],
  },

  LoadingMessageHeader: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'HeaderPKBadge',
      },
      {
        id: 'react',
      },
    ],
  },

  ColorMessageHeader: {
    dependencies: [
      {
        ext: 'pluralchum',
        id: 'contrast',
      },
      {
        ext: 'pluralchum',
        id: 'data',
      },
      {
        ext: 'pluralchum',
        id: 'HeaderPKBadge',
      },
      {
        id: 'react',
      },
    ],
  },
};
