import type { WebpackRequireType } from '@moonlight-mod/types';
const webpackRequire = require as unknown as WebpackRequireType;

export function wrapMessageActionCreators(orig) {
  return {
    ...orig,
    editMessage(...args) {
      return webpackRequire('pluralchum_main').editMessage(orig.editMessage, ...args);
    },
  };
}
