import { baseEndpoint, httpGetAsync, PK_USERID } from './api';
import { addItem, MenuItem } from '@moonlight-mod/wp/contextMenu_contextMenu';
// @ts-expect-error no type definitions
import MessageActionCreators from '@moonlight-mod/wp/discord/actions/MessageActionCreators';
import { PKEditIcon, PKEditIconPopover, PKTrashIcon, PKTrashIconPopover } from './PKIcons';
import React from '@moonlight-mod/wp/react';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import { isProxiedMessage } from './utility';
import { getUserHash } from './profiles';

import { UserStore, MessageStore, ChannelStore, PermissionStore } from '@moonlight-mod/wp/common_stores';
import { Permissions } from '@moonlight-mod/wp/discord/Constants';

import Pluralchum from './singleton';
// @ts-expect-error cannot find module
import { addMessagePopoverButton } from '@moonlight-mod/wp/messagePopover_messagePopover';

const privateCommands = moonlight.getConfigOption('pluralchumPlus', 'privateCommands');

function isOwnMessage(message) {
  const currentUserId = UserStore.getCurrentUser().id;
  if (message.author?.id === currentUserId) {
    return true;
  }
  const sender = Pluralchum.profileMap.get(getUserHash(message))?.sender;
  if (isProxiedMessage(message) && sender === currentUserId) {
    updateSystemMembers(message);
    return true;
  }
}

let currentSystemMembers = null;
async function updateSystemMembers(message) {
  if (currentSystemMembers) {
    return;
  }
  currentSystemMembers = 'placeholder';

  const currentProfile = Pluralchum.profileMap.get(getUserHash(message));
  const profileResponse = await httpGetAsync(`${baseEndpoint}/systems/${currentProfile.system}/members`);
  if (profileResponse.status != 200) {
    return null;
  }

  const profileResponseData: any[] = Array.from(await profileResponse.json());
  if (profileResponseData.length == 1) {
    return null;
  }

  currentSystemMembers = profileResponseData;
  patchReproxyMessageAction();
}

export function patchMessageActions() {
  // TODO: refactor MessagePopoverAPI so it functions similarly to ContextMenu's MenuItems
  // also make code smaller. we do the same-ish thing twice for each element

  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKey);

  addMessageContextMenuItem(
    props =>
      isProxiedMessage(props.message) &&
      isOwnMessage(props.message) && (
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

  addMessagePopoverButton(
    'pk-edit',
    message => {
      if (!(message && isProxiedMessage(message) && isOwnMessage(message))) return null;

      return {
        label: 'Edit Proxied Message',
        icon: () => {
          return <PKEditIconPopover />;
        },
        message: message,
        channel: ChannelStore.getChannel(message.channel_id),
        onClick: () => MessageActionCreators.startEditMessage(message.channel_id, message.id, message.content),
        onContextMenu: () => {},
      };
    },
    <PKEditIconPopover />,
  );

  addMessageContextMenuItem(
    props =>
      isProxiedMessage(props.message) &&
      isOwnMessage(props.message) &&
      !PermissionStore.can(Permissions.MANAGE_MESSAGES, ChannelStore.getChannel(props.message.channel_id)) && (
        <MenuItem
          id='pk-delete'
          label='Delete Proxied Message'
          color='danger'
          icon={<PKTrashIcon />}
          action={() => {
            deleteMessage(props.message);
          }}
        />
      ),
    'report',
    true,
  );

  addMessagePopoverButton(
    'pk-delete',
    message => {
      if (!(message && isProxiedMessage(message) && isOwnMessage(message))) return null;
      if (!shiftKey || PermissionStore.can(Permissions.MANAGE_MESSAGES, ChannelStore.getChannel(message.channel_id)))
        return null;

      return {
        label: 'Delete Proxied Message',
        icon: () => {
          return <PKTrashIconPopover />;
        },
        dangerous: true,
        message: message,
        channel: ChannelStore.getChannel(message.channel_id),
        onClick: () => deleteMessage(message),
        onContextMenu: () => {},
      };
    },
    <PKTrashIconPopover />,
  );
}

function patchReproxyMessageAction() {
  addMessageContextMenuItem(
    props =>
      isProxiedMessage(props.message) &&
      isOwnMessage(props.message) && (
        <MenuItem id='pk-reproxy' label='Reproxy As...'>
          {currentSystemMembers?.map(member => (
            <MenuItem
              id={'pk_menu_item_' + member.uuid}
              icon={
                <div className='iconContainer_c1e9c4'>
                  <img
                    className='pk-menu-icon icon_c1e9c4 avatar__07f91'
                    src={member?.avatar_url ?? 'https://pluralkit.me/favicon.png'}
                    width='20px'
                    height='20px'
                  />
                </div>
              }
              label={
                <div className='pk-menu-item'>
                  <div className='pk-menu-item'>{member.display_name}</div>
                </div>
              }
              action={() => {
                const { guild_id } = ChannelStore.getChannel(props.message.channel_id);
                MessageActionCreators.sendMessage(
                  privateCommands ? ChannelStore.getDMFromUserId(PK_USERID) : props.message.channel_id,
                  {
                    reaction: false,
                    tts: false,
                    invalidEmojis: [],
                    validNonShortcutEmojis: [],
                    content:
                      'pk;reproxy https://discord.com/channels/' +
                      guild_id +
                      '/' +
                      props.message.channel_id +
                      '/' +
                      props.message.id +
                      ' ' +
                      member?.name,
                  },
                  false,
                  {},
                );
              }}
            />
          ))}
        </MenuItem>
      ),
    'copy-link',
    true,
  );
}

export function addMessageContextMenuItem<T = any>(item: React.FC<T>, anchor: string | RegExp, before = false) {
  addItem('message', item, anchor, before);
  addItem('message-actions', item, anchor, before);
}

export function editMessage(orig, channelId, messageId, message) {
  if (isProxiedMessage(MessageStore.getMessage(channelId, messageId))) {
    const { content } = message;
    const channel = ChannelStore.getChannel(channelId);
    const guildId = channel.guild_id;
    const str = 'pk;e https://discord.com/channels/' + guildId + '/' + channelId + '/' + messageId + ' ' + content;
    MessageActionCreators.sendMessage(
      privateCommands ? ChannelStore.getDMFromUserId(PK_USERID) : channelId,
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
    .find(m => isOwnMessage(m));
}

const addReaction = spacepack.findFunctionByStrings(
  spacepack.findByCode('.userHasReactedWithEmoji')[0].exports,
  '.userHasReactedWithEmoji',
) as (channelId: any, messageId: any, reactionEmoji: { name: string }) => void;

export function deleteMessage(message) {
  if (addReaction) addReaction(message.channel_id, message.id, { name: '❌' });
}

let shiftKey = false;
function onKey(e: KeyboardEvent) {
  shiftKey = e.shiftKey;
}
