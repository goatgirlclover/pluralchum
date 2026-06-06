import HeaderPKBadge from '@moonlight-mod/wp/pluralchum_HeaderPKBadge';
import React from '@moonlight-mod/wp/react';

export default function LoadingMessageHeader({ messageHeader, profile, userHash }) {
  return {
    ...messageHeader,
    props: {
      ...messageHeader.props,
      children: [
        messageHeader.props.children[2],
        <HeaderPKBadge userHash={userHash} profile={profile} key='HeaderPKBadge' />,
      ],
    },
  };
}
