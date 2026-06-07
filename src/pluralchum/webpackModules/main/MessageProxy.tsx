import { hookupProfile } from './profiles';
import { isProxiedMessage, useValueCell } from './utility';
import Pluralchum from './singleton';
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
  logger.trace(`wrapper for ${message.id}`);
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

export default function MessageProxy(orig, props) {
  const messageNode = orig(props);
  const message = props?.childrenMessageContent?.props?.children?.props?.message;

  logger.trace(`handling message ${message?.id}`);
  const [enabled] = useValueCell(Pluralchum.enabled);

  if (enabled && message && isProxiedMessage(message)) {
    logger.trace('wrapping');
    return <MessageProxyInner messageNode={messageNode} message={message} />;
  } else {
    if (!enabled) logger.trace('disabled');
    if (!message) logger.trace('no message');
    return messageNode;
  }
}
