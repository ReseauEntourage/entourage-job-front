import { useRouter } from 'next/router';
import React from 'react';
import { Text } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { LucidIcon } from '../Icons/LucidIcon';
import { StyledBackLink } from './BackLink.styles';

interface BackLinkProps {
  label: string;
}
export function BackLink({ label }: BackLinkProps) {
  const router = useRouter();

  return (
    <StyledBackLink aria-label={label}>
      <LucidIcon name="ChevronLeft" size={22} color={COLORS.darkGray} />
      <Text onClick={() => router.back()} color="darkGray">
        {label}
      </Text>
    </StyledBackLink>
  );
}
