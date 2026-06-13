import { hookupProfile } from './profiles';
import { MapCell, isProxiedMessage, getInternalInstance, useValueCell } from './utility';
import Pluralchum from './singleton';
import React from '@moonlight-mod/wp/react';
import { HiddenMessage, Reason } from './HiddenMessage';
import { RelationshipStore } from '@moonlight-mod/wp/common_stores';

const logger = moonlight.getLogger('pluralchum/MessageProxy');

const unblockedMap = new MapCell({});

function lookForMatch(messageId) {
  const node = document.querySelector('[data-list-id="chat-messages"]');
  const component = getInternalInstance(node)?.memoizedProps?.children?.[1]?.find(m => m.key === messageId);
  if (component) {
    const message = component.props?.message;
    const groupId = component.props?.groupId;
    if (message && groupId) {
      return { message, groupId };
    } else {
      return null;
    }
  }
}

function useMessage(messageId) {
  const [ret, setRet] = React.useState({ message: null, groupId: null });

  React.useEffect(
    function () {
      let mutationObserver;
      const r = lookForMatch(messageId);

      if (r && messageId) {
        setRet(r);
      } else if (messageId) {
        mutationObserver = new MutationObserver(function () {
          const r = lookForMatch(messageId);
          if (r) {
            setRet(r);
            mutationObserver.disconnect();
          }
        });
        const node = document.querySelector('[data-list-id="chat-messages"]');
        mutationObserver.observe(node, { childList: true });
      }
      return function () {
        mutationObserver?.disconnect();
      };
    },
    [messageId],
  );

  return ret;
}

function checkHidden(profile) {
  if (profile?.sender && RelationshipStore.isBlocked(profile.sender)) {
    return Reason.Blocked;
  } else if (profile?.sender && RelationshipStore.isIgnored(profile.sender)) {
    return Reason.Ignored;
  } else {
    return null;
  }
}

function MessageProxyInner({ messageNode, message, groupId }) {
  logger.trace(`wrapper for ${message.id}`);
  const [profile] = hookupProfile(message);

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
  }
}

export default function MessageProxy(orig, props) {
  const messageNode = orig(props);
  const message = props?.childrenMessageContent?.props?.children?.props?.message;
  const { groupId } = useMessage(message?.id);

  logger.trace(`handling message ${message?.id}`);
  const [enabled] = useValueCell(Pluralchum.enabled);

  if (enabled && message && isProxiedMessage(message)) {
    logger.trace('wrapping');
    return <MessageProxyInner messageNode={messageNode} message={message} groupId={groupId} />;
  } else {
    if (!enabled) logger.trace('disabled');
    if (!message) logger.trace('no message');
    return messageNode;
  }
}
