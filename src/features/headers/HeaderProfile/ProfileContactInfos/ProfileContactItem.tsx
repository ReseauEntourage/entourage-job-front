import React from 'react';
import { Text } from '@/src/components/ui';
import { StyledProfileContactItem } from './ProfileContactItem.styles';

export interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
}

export const ProfileContactItem = ({ icon, text }: ContactItemProps) => {
  return (
    <StyledProfileContactItem>
      {icon}
      <Text size="large">{text}</Text>
    </StyledProfileContactItem>
  );
};
