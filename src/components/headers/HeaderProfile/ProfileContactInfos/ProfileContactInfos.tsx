import React from 'react';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { StyledProfileContactInfos } from './ProfileContactInfos.styles';
import { ProfileContactItem } from './ProfileContactItem';

export interface ContactInfosProps {
  phone?: string;
  email?: string;
  driverLicenses?: string[];
}

export const ProfileContactInfos = ({
  phone,
  email,
  driverLicenses,
}: ContactInfosProps) => {
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
      {driverLicenses && driverLicenses.length > 0 && (
        <ProfileContactItem
          icon={<LucidIcon name="Car" size={20} />}
          text={`Permis ${driverLicenses.join(', ')}`}
        />
      )}
    </StyledProfileContactInfos>
  );
};
