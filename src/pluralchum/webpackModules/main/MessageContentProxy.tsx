import { useValueCell, isProxiedMessage } from './utility';
import { ProfileStatus, updateProfile, hookupProfile } from './profiles';
import { acceptableContrast } from './contrast';
import Pluralchum from './singleton';
import ColorMessageContent from './ColorMessageContent';
import React from '@moonlight-mod/wp/react';

const logger = moonlight.getLogger('pluralchum/MessageContentProxy');

function shouldColor(profile) {
  const doContrastTest = moonlight.getConfigOption('pluralchum', 'doContrastTest');
  const contrastTestColour = moonlight.getConfigOption('pluralchum', 'contrastTestColour');
  const contrastThreshold = moonlight.getConfigOption('pluralchum', 'contrastThreshold');
  const doColourText = moonlight.getConfigOption('pluralchum', 'doColourText');

  logger.debug(doColourText, profile, profile.color, doContrastTest, contrastTestColour, contrastThreshold);

  return (
    doColourText &&
    profile &&
    (profile.status === ProfileStatus.Done || profile.status === ProfileStatus.Updating) &&
    profile.color &&
    acceptableContrast(profile.color, doContrastTest, contrastTestColour, contrastThreshold)
  );
}

export default function MessageContentProxy(memo, orig) {
  return memo(props => {
    const messageContent = orig(props);
    logger.debug(props);
    const message = props?.message;

    if (!message) return messageContent;

    logger.debug(`handling message ${message.id}`);

    const [profile] = hookupProfile(message);
    const [enabled] = useValueCell(Pluralchum.enabled);

    if (!enabled || !isProxiedMessage(message)) {
      logger.debug(`ignoring message ${message.id}`);
      return messageContent;
    }

    updateProfile(message);

    if (shouldColor(profile)) {
      logger.debug(`coloring message ${message.id}`);
      return <ColorMessageContent color={profile.color} messageContent={messageContent} />;
    } else {
      logger.debug(`not coloring message ${message.id}`);
      return messageContent;
    }
  });
}
