import { useValueCell, isProxiedMessage } from './utility';
import { hookupProfile, updateProfile, ProfileStatus, getUserHash } from './profiles';
import Pluralchum from './singleton';
import React from '@moonlight-mod/wp/react';
import ColoredMessageHeader from './ColorMessageHeader';
import LoadingMessageHeader from './LoadingMessageHeader';

const logger = moonlight.getLogger('pluralchumPlus/MessageHeaderProxy');

export default function MessageHeaderProxy(orig, props) {
  const messageHeader = orig(props);
  const message = props?.message;
  const guildId = props?.channel?.guild_id;
  const onClickUsername = props?.onClick;

  const [profile] = hookupProfile(message);
  const [enabled] = useValueCell(Pluralchum.enabled);

  if (!enabled || !isProxiedMessage(message)) {
    return messageHeader;
  }

  updateProfile(message);

  const userHash = getUserHash(message);

  logger.trace(profile);

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
