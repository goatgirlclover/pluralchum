import { ThreeDots } from './ThreeDots';
import { ProfileStatus } from './profiles';
import Pluralchum from './singleton';
import React from '@moonlight-mod/wp/react';

export default function PopoutPKBadge({ userHash, profile }) {
  const status = profile.status;

  const onClick = function () {
    Pluralchum.profileMap.update(userHash, function (profile) {
      profile.status = ProfileStatus.Stale;
      return profile;
    });
  };

  const linkStyle = {
    color: '#ffffff',
  };
  let content: React.ReactNode = 'PK';
  if ([ProfileStatus.Updating, ProfileStatus.Requesting, ProfileStatus.Stale].includes(status)) {
    const dotstyle = {
      height: '.4em',
      width: '100%',
      display: 'inline',
      'vertical-align': 'top',
      'padding-top': '0.55em',
    };
    content = <ThreeDots style={dotstyle} />;
  }

  return (
    <span className='botTagCozy_c19a55 botTag_c19a55 botTagRegular__82f07 botTag__82f07 rem__82f07'>
      <div className='botText__82f07'>
        <a style={linkStyle} onClick={onClick}>
          {content}
        </a>
      </div>
    </span>
  );
}
