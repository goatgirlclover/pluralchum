import { baseEndpoint, httpGetAsync } from './api';
import { isProxiedMessage } from './utility';
import Pluralchum from './singleton';
import React from '@moonlight-mod/wp/react';

export const ProfileStatus = {
  Done: 'DONE',
  Updating: 'UPDATING',
  Requesting: 'REQUESTING',
  NotPK: 'NOT_PK',
  Stale: 'STALE',
};

const logger = moonlight.getLogger('pluralchumPlus/profiles');

function pkDataToProfile(data) {
  const profile = {
    name: data.member.name,
    color: '#' + data.member.color,
    tag: data.system.tag,
    id: data.member.id,
    system: data.system.id,
    status: ProfileStatus.Done,
    system_color: '#' + data.system.color,
    sender: data.sender,
    description: data.member.description ?? '',
    system_description: data.system.description ?? '',
    avatar: data.member.avatar_url ?? data.system.avatar_url,
    banner: data.member.banner,
    system_name: data.system.name,
    pronouns: data.member.pronouns,
  };

  if (data.member.color === null) profile.color = '';

  if (data.system.color === null) profile.system_color = '';

  if (data.member.display_name) {
    profile.name = data.member.display_name;
  }

  if (data.member.pronouns === null) profile.pronouns = '';

  return profile;
}

async function pkResponseToProfile(response) {
  if (response.status == 200) {
    logger.info('RESPONSE');
    const data = await response.json();
    logger.info(data);
    if (data.system == null && data.member == null) return { status: ProfileStatus.NotPK };
    return pkDataToProfile(data);
  } else if (response.status == 404) {
    return { status: ProfileStatus.NotPK };
  }
}

async function getFreshProfile(message) {
  const profileResponse = await httpGetAsync(`${baseEndpoint}/messages/${message.id}`);
  return await pkResponseToProfile(profileResponse);
}

async function updateFreshProfile(message, hash, profileMap) {
  profileMap.update(hash, function (profile) {
    if (profile !== null) {
      profile.status = ProfileStatus.Updating;
      return profile;
    } else {
      return { status: ProfileStatus.Requesting };
    }
  });

  const profile = await getFreshProfile(message);

  profileMap.set(hash, profile);
}

function hashCode(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getUserHash(message) {
  const author = message.author;
  let username = author.username;
  const app_id = message.application_id;
  if (Object.hasOwn(author, 'username_real')) username = author.username_real;

  return hashCode(username + author.avatar + app_id);
}

function shouldUpdate(profile) {
  return !profile || profile.status === ProfileStatus.Stale;
}

export async function updateProfile(message) {
  if (!isProxiedMessage(message)) return null;
  logger.trace(`updating profile for ${message.id}`);

  let username = message.author.username;
  if (Object.hasOwn(message.author, 'username_real')) username = message.author.username_real;

  const userHash = getUserHash(message);

  const profile = Pluralchum.profileMap.get(userHash);

  if (shouldUpdate(profile)) {
    logger.info(`Requesting data for ${username} (${userHash})`);
    try {
      await updateFreshProfile(message, userHash, Pluralchum.profileMap);
    } catch (e) {
      logger.info(`Error while requesting data for ${username} (${userHash}): ${e}`);
    }
  }
}

export function hookupProfile(message) {
  logger.trace(`hooking up profile for ${message?.id}`);

  const userHash = getUserHash(message);
  logger.trace(`user hash: ${userHash}`);

  const [profile, setProfile] = React.useState(Pluralchum.profileMap.get(userHash));
  React.useEffect(function () {
    return Pluralchum.profileMap.addListener(function (key, value) {
      if (key === userHash) {
        setProfile(value);
      }
    });
  });

  return [profile, setProfile];
}
