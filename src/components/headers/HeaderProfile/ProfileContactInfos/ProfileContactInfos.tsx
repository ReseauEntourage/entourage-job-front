import React from 'react';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledProfileContactInfos } from './ProfileContactInfos.styles';
import { ProfileContactItem } from './ProfileContactItem';

export interface ContactInfosProps {
  phone?: string;
  email?: string;
}

export const ProfileContactInfos = ({ phone, email }: ContactInfosProps) => {
  if (!phone && !email) {
    return null;
  }
  return (
    <StyledProfileContactInfos>
      {phone && (
        <ProfileContactItem
          icon={<LucidIcon name="Phone" size={20} />}
          text={phone}
        />
      )}
      {email && (
        <ProfileContactItem
          icon={<LucidIcon name="Mail" size={20} />}
          text={email}
        />
      )}
    </StyledProfileContactInfos>
  );
};
