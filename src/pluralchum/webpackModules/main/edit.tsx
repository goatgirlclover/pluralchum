import { addItem, MenuItem } from '@moonlight-mod/wp/contextMenu_contextMenu';
// @ts-expect-error no type definitions
import MessageActionCreators from '@moonlight-mod/wp/discord/actions/MessageActionCreators';
import PKEditIcon from './PKEditIcon';
import React from '@moonlight-mod/wp/react';
import { isProxiedMessage } from './utility';
import { getUserHash } from './profiles';
import { UserStore, MessageStore, ChannelStore } from '@moonlight-mod/wp/common_stores';
import Pluralchum from './singleton';

function isEditable(message) {
  const currentUserId = UserStore.getCurrentUser().id;
  if (message.author?.id === currentUserId) {
    return true;
  }
  const sender = Pluralchum.profileMap.get(getUserHash(message))?.sender;
  return isProxiedMessage(message) && sender === currentUserId;
}

export function patchEditMenuItem() {
  addItem(
    'message',
    props =>
      isProxiedMessage(props.message) &&
      isEditable(props.message) && (
        <MenuItem
          id='pk-edit'
          label='Edit Proxied Message'
          icon={<PKEditIcon />}
          action={() => {
            MessageActionCreators.startEditMessage(props.message.channel_id, props.message.id, props.message.content);
          }}
        />
      ),
    'reply',
    true,
  );
}

export function editMessage(orig, channelId, messageId, message) {
  if (isProxiedMessage(MessageStore.getMessage(channelId, messageId))) {
    const { content } = message;
    const channel = ChannelStore.getChannel(channelId);
    const guildId = channel.guild_id;
    const str = 'pk;e https://discord.com/channels/' + guildId + '/' + channelId + '/' + messageId + ' ' + content;
    MessageActionCreators.sendMessage(
      channelId,
      {
        reaction: false,
        content: str,
        tts: false,
        invalidEmojis: [],
        validNonShortcutEmojis: [],
      },
      false,
      {},
    );
  } else {
    return orig(channelId, messageId, message);
  }
}

export function getLastEditableMessage(channelId) {
  return MessageStore.getMessages(channelId)
    .toArray()
    .reverse()
    .find(m => isEditable(m));
}
