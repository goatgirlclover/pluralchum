import { fix } from '@ariagivens/discord-unicode-fix-js';
import { acceptableContrast } from './contrast';
import { ColourPreference } from './data';
import HeaderPKBadge from './HeaderPKBadge';
import React from '@moonlight-mod/wp/react';
import { GuildMemberStore } from '@moonlight-mod/wp/common_stores';

function normalize(str) {
  return fix(str).normalize('NFD');
}

function getServername(username, tag) {
  if (!tag || tag.length === 0) {
    return null;
  }

  username = normalize(username);
  tag = normalize(tag);

  const username_len = username.length;
  const tag_len = tag.length + 1; // include the space as part of the tag

  if (username.endsWith(tag)) {
    return username.slice(0, username_len - tag_len);
  } else {
    return null;
  }
}

function getUsername(useServerNames, author, profile) {
  const username = normalize(author.username_real ?? author.username.slice());
  const tag = normalize(profile.tag ?? '');
  if (useServerNames) {
    const servername = getServername(username, tag);
    if (servername) {
      // we can seperate servername and tag
      return { username: servername, memberTag: tag };
    } else {
      // most likely using a servertag, treat the whole thing as the username
      return { username, memberTag: '' };
    }
  } else {
    return { username: normalize(profile.name), memberTag: tag };
  }
}

function NameSegment({ colour, name }) {
  return (
    <span className='username_c19a55 pk-name-segment' style={{ color: colour }}>
      {name}
    </span>
  );
}

function getColour(colourPref, member, guildId, defaultSystemColourToMemberColour) {
  let colour;

  switch (colourPref) {
    case ColourPreference.Member:
      colour = member.color ?? member.system_color;
      break;
    case ColourPreference.System:
      if (defaultSystemColourToMemberColour) {
        colour = member.system_color ?? member.color;
      } else {
        colour = member.system_color;
      }
      break;
    case ColourPreference.Role:
      colour = GuildMemberStore.getMember(guildId, member.sender)?.colorString;
      break;
    default:
      colour = null;
      break;
  }

  const doContrastTest = moonlight.getConfigOption('pluralchum', 'doContrastTest');
  const contrastTestColour = moonlight.getConfigOption('pluralchum', 'contrastTestColour');
  const contrastThreshold = moonlight.getConfigOption('pluralchum', 'contrastThreshold');
  if (colour && acceptableContrast(colour, doContrastTest, contrastTestColour, contrastThreshold)) {
    return colour;
  } else {
    return null;
  }
}

function createHeaderChildren(message, guildId, profile, userHash, onClickUsername) {
  const memberColourPref = moonlight.getConfigOption('pluralchum', 'memberColourPref');
  const tagColourPref = moonlight.getConfigOption('pluralchum', 'tagColourPref');
  const useServerNames = moonlight.getConfigOption('pluralchum', 'useServerNames');

  const { username, memberTag } = getUsername(useServerNames, message.author, profile);

  const memberColour = getColour(memberColourPref, profile, guildId, true);
  const tagColour = getColour(tagColourPref, profile, guildId, false);

  const doSysTag = memberTag && memberTag.length > 0;

  return [
    <span className='username_c19a55 pk-name' onClick={onClickUsername} key='PKName'>
      <NameSegment colour={memberColour} name={username} key='NameSegment' />
      {doSysTag ? ' ' : null}
      {doSysTag ? <NameSegment colour={tagColour} name={memberTag} /> : null}
    </span>,
    <HeaderPKBadge userHash={userHash} profile={profile} key='HeaderPKBadge' />,
  ];
}

export default function ColorMessageHeader({ profile, userHash, messageHeader, message, guildId, onClickUsername }) {
  return {
    ...messageHeader,
    props: {
      ...messageHeader.props,
      children: [
        createHeaderChildren(message, guildId, profile, userHash, onClickUsername),
        // Triggering the popout with correct position is hard, so we just leave the original
        // header here (but hide it using CSS) so the popout can take its position.
        <div className='pk-hidden' key='HiddenMessageHeader'>
          {messageHeader.props.children}
        </div>,
      ],
    },
  };
}
