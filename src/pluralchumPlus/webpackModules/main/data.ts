import { MapCell, pluginName } from './utility';
import { ProfileStatus } from './profiles';

export const ColourPreference = {
  Member: 'Member',
  System: 'System',
  Theme: 'Theme', // (do nothing)
  Role: 'Role',
};

function filterDoneProfiles(entries) {
  const filtered = entries.filter(([_, profile]) => profile.status === ProfileStatus.Done);
  return Object.fromEntries(filtered);
}

export function initializeProfileMap() {
  const key = 'profileMap';
  const map = new MapCell(moonlight.getConfigOption(pluginName, key) ?? {});
  map.addListener(async function () {
    await moonlight.setConfigOption(pluginName, key, filterDoneProfiles(map.entries()));
  });
  return map;
}

function tooOld(lastUsed) {
  const expirationTime = 1000 * 60 * 60 * 24 * 30;
  return Date.now() - lastUsed > expirationTime;
}

export function purgeOldProfiles(profileMap) {
  if (!profileMap) return;

  for (const [id, profile] of profileMap.entries()) {
    if (Object.hasOwn(profile, 'lastUsed')) {
      if (tooOld(profile.lastUsed)) {
        profileMap.delete(id);
      }
    } else {
      profileMap.update(id, function () {
        return { ...profile, lastUsed: Date.now() };
      });
    }
  }
}
