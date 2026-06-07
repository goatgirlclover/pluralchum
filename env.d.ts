/// <reference types="@moonlight-mod/types" />

declare module '@moonlight-mod/wp/pluralchum_main' {
  export * from 'pluralchum/webpackModules/main';
}

declare module '*.svg' {
  import React from '@moonlight-mod/wp/react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}
