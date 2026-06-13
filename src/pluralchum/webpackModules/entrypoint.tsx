import { Pluralchum } from '@moonlight-mod/wp/pluralchum_main';
import Moonbase from '@moonlight-mod/wp/moonbase_moonbase';
import React from '@moonlight-mod/wp/react';
import Button from '@moonlight-mod/wp/discord/design/components/Button/web/Button';

Pluralchum.start();
Moonbase.registerConfigComponent('pluralchum', 'clearCache', () => (
  <Button text='Clear cache' variant='critical-primary' onClick={() => {
      Pluralchum.profileMap?.clear();
    }}
  />
));
