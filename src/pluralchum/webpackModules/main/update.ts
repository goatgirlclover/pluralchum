import Pluralchum from './singleton';
import { pluginName } from './utility';
import { ProfileStatus } from './profiles';

import manifest from '../../manifest.json';
const currentVersion = manifest.version;

export function upgradeCache() {
  const cacheVersion = moonlight.getConfigOption(pluginName, 'cacheVersion') ?? {};
  if (cacheVersion != currentVersion) {
    moonlight.setConfigOption(pluginName, 'cacheVersion', currentVersion);

    for (const [key, value] of Pluralchum.profileMap.entries()) {
      // @ts-expect-error spread types only from object types
      Pluralchum.profileMap.set(key, { ...value, status: ProfileStatus.Stale });
    }
  }
}
