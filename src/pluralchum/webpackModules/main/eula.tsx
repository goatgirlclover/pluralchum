import React from '@moonlight-mod/wp/react';
import { pluginName } from './utility';
import { openModal, closeModal } from '@moonlight-mod/wp/discord/modules/modals/Modals';
import MarkupClasses from '@moonlight-mod/wp/discord/modules/messages/web/Markup.css';
import {
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalRoot,
  ModalSize,
} from '@moonlight-mod/wp/discord/design/components/Modal/web/LegacyModal';
import Flex from '@moonlight-mod/wp/discord/uikit/Flex';
import Text from '@moonlight-mod/wp/discord/design/components/Text/Text';

let modalKey: string;

function EULAModal() {
  return (
    <ModalRoot size={ModalSize.DYNAMIC} transitionState={0}>
      <ModalHeader>
        <Flex.Child grow={1} shrink={1}>
          <Text variant='heading-lg/semibold'>Heads up!</Text>
        </Flex.Child>

        <Flex.Child grow={0}>
          <ModalCloseButton
            onClick={() => {
              moonlight.setConfigOption(pluginName, 'eula', 'true');
              closeModal(modalKey);
            }}
          />
        </Flex.Child>
      </ModalHeader>

      <ModalContent>
        <Text variant='text-md/normal' className={MarkupClasses.markup} style={{ padding: '1rem' }}>
          <div style={{ color: 'var(--text-normal)', textAlign: 'center' }}>
            Pluralchum uses the PluralKit API to fetch system and member data. <br />
            <br />
            Because of technical limitations, this data is cached on your computer between sessions. None of this data
            is ever shared, collected or uploaded, but you still ought to know.
            <br />
            <br />
            <b>You can clear this cache at any time in the plugin settings</b>, and unused cache data is automatically
            deleted after 30 days.
          </div>
        </Text>
      </ModalContent>
    </ModalRoot>
  );
}

export function requireEula() {
  if (moonlight.getConfigOption(pluginName, 'eula') != 'true') {
    modalKey = openModal(EULAModal);
  }
}
