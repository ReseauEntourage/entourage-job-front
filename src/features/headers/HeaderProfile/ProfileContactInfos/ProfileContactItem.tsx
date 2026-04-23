import React from 'react';
import { Text } from '@/src/components/ui';
import { StyledProfileContactItem } from './ProfileContactItem.styles';

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
}

export const ProfileContactItem = ({ icon, text }: ContactItemProps) => {
  return (
    <StyledProfileContactItem>
      {icon}
      <Text size="small">{text}</Text>
    </StyledProfileContactItem>
  );
};
