import React from 'react';
import { Text } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import {
  StyledInfosContainer,
  StyledPrivacyContainer,
  StyledProfileContactInfos,
} from './ProfileContactInfos.styles';
import { ProfileContactItem } from './ProfileContactItem';

interface ContactInfosProps {
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
      <StyledPrivacyContainer>
        <LucidIcon name="Shield" size={16} />
        <Text size="xsmall">
          Ces informations sont visibles uniquement par vous et ne sont pas
          partagées publiquement.
        </Text>
      </StyledPrivacyContainer>
      <StyledInfosContainer>
        {phone && (
          <ProfileContactItem
            icon={<LucidIcon name="Phone" size={15} />}
            text={phone}
          />
        )}
        {email && (
          <ProfileContactItem
            icon={<LucidIcon name="Mail" size={15} />}
            text={email}
          />
        )}
        {driverLicenses && driverLicenses.length > 0 && (
          <ProfileContactItem
            icon={<LucidIcon name="Car" size={15} />}
            text={`Permis ${driverLicenses.join(', ')}`}
          />
        )}
      </StyledInfosContainer>
    </StyledProfileContactInfos>
  );
};
