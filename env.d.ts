/// <reference types="@moonlight-mod/types" />

declare module '@moonlight-mod/wp/pluralchumPlus_main' {
  export * from 'pluralchumPlus/webpackModules/main';
}

declare module '*.svg' {
  import React from '@moonlight-mod/wp/react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
