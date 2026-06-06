import { useValueCell, isProxiedMessage } from '@moonlight-mod/wp/pluralchum_utility';
import { hookupProfile, updateProfile, ProfileStatus, getUserHash } from '@moonlight-mod/wp/pluralchum_profiles';
import Pluralchum from '@moonlight-mod/wp/pluralchum_main';
import React from '@moonlight-mod/wp/react';
import ColoredMessageHeader from './ColorMessageHeader.js';
import LoadingMessageHeader from '@moonlight-mod/wp/pluralchum_LoadingMessageHeader';

const logger = moonlight.getLogger('pluralchum/MessageHeaderProxy');

export default function MessageHeaderProxy({ messageHeader, message, guildId, onClickUsername }) {
  const [profile] = hookupProfile(message);
  const [enabled] = useValueCell(Pluralchum.enabled);

  if (!enabled || !isProxiedMessage(message)) {
    return messageHeader;
  }

  updateProfile(message);

  const userHash = getUserHash(message);

  logger.debug(profile);

  if (profile && (profile.status === ProfileStatus.Done || profile.status === ProfileStatus.Updating)) {
    return (
      <ColoredMessageHeader
        profile={profile}
        userHash={userHash}
        messageHeader={messageHeader}
        message={message}
        guildId={guildId}
        onClickUsername={onClickUsername}
      />
    );
  } else if (!profile || profile.status === ProfileStatus.Requesting) {
    return (
      <LoadingMessageHeader
        messageHeader={messageHeader}
        profile={{ status: ProfileStatus.Requesting }}
        userHash={userHash}
      />
    );
  } else {
    return messageHeader;
  }
}
