import { hookupProfile } from '@moonlight-mod/wp/pluralchum_profiles';
import { useValueCell } from '@moonlight-mod/wp/pluralchum_utility';
import Pluralchum from '@moonlight-mod/wp/pluralchum_main';
import React from '@moonlight-mod/wp/react';
//import { HiddenMessage, Reason } from './HiddenMessage';
//const RelationshipStore = BdApi.Webpack.Stores.RelationshipStore;

const logger = moonlight.getLogger('pluralchum/MessageProxy');

/*function checkHidden(profile) {
  if (profile?.sender && RelationshipStore.isBlocked(profile.sender)) {
    return Reason.Blocked;
  } else if (profile?.sender && RelationshipStore.isIgnored(profile.sender)) {
    return Reason.Ignored;
  } else {
    return null;
  }
}*/

function MessageProxyInner({ messageNode, message }) {
  logger.debug(`wrapper for ${message.id}`);
  hookupProfile(message);
  return messageNode;
  /*const [profile] = hookupProfile(profileMap, message);

  const reason = checkHidden(profile);
  if (reason) {
    return (
      <HiddenMessage
        unblockedMap={unblockedMap}
        message={message}
        messageNode={messageNode}
        groupId={groupId}
        reason={reason}
      />
    );
  } else {
    return messageNode;
  }*/
}

export default function MessageProxy({ messageNode, message }) {
  logger.debug(`handling message ${message?.id}`);
  const [enabled] = useValueCell(Pluralchum.enabled);

  if (enabled && message) {
    logger.debug('wrapping');
    return <MessageProxyInner messageNode={messageNode} message={message} />;
  } else {
    if (!enabled) logger.debug('disabled');
    if (!message) logger.debug('no message');
    return messageNode;
  }
}
