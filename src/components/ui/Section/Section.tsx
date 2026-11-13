import React, { type JSX } from 'react';
import {
  StyledSection,
  StyledSectionContainer,
  StyledSectionRoot,
} from '@/src/components/ui/Section/Section.styles';
import { SECTION_SIZES, SECTION_STYLES } from '@/src/components/variables';

interface SectionProps {
  style?: SECTION_STYLES;
  size?: SECTION_SIZES;
  id?: string;
  children: JSX.Element | JSX.Element[] | React.ReactNode;
  container?: 'small' | 'large';
  className?: string;
  display?: string;
  /** Centers the text of the whole section. */
  textCenter?: boolean;
}

export const Section = ({
  style,
  size,
  id,
  container,
  children,
  className,
  display = '',
  textCenter = false,
}: SectionProps) => {
  // A `custom…` class name selects one of the dedicated sections of `StyledSection`.
  if (className?.includes('custom')) {
    return (
      <StyledSection className={className}>
        <div className={`${display} section-container`}>{children}</div>
      </StyledSection>
    );
  }

  return (
    <StyledSectionRoot
      className={className}
      id={id}
      $style={style}
      $size={size}
      $textCenter={textCenter}
    >
      <StyledSectionContainer $container={container}>
        {children}
      </StyledSectionContainer>
    </StyledSectionRoot>
  );
};
