import { useRouter } from 'next/router';
import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { LucidIcon } from '../Icons/LucidIcon';
import { Text } from 'src/components/utils';
import { StyledBackLink } from './BackLink.styles';

interface BackLinkProps {
  label: string;
}
export function BackLink({ label }: BackLinkProps) {
  const router = useRouter();

  return (
    <StyledBackLink>
      <LucidIcon name="ChevronLeft" size={22} color={COLORS.darkGray} />
      <Text onClick={() => router.back()} color="darkGray">
        {label}
      </Text>
    </StyledBackLink>
  );
}
