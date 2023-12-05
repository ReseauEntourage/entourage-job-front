import React from 'react';
import { StyledSection } from 'src/components/utils/Section/Section.styles';
import { UIKIT_SECTION_SIZES, UIKIT_STYLES } from 'src/components/variables';

interface SectionProps {
  style?: UIKIT_STYLES;

  size?: UIKIT_SECTION_SIZES;
  id?: string;
  children: JSX.Element | JSX.Element[] | React.ReactNode;
  container?: 'small' | 'large';
  className?: string;
  preserveColor?: boolean;
  display?: string;
}
export const Section = ({
  style,
  size,
  id,
  container,
  children,
  className,
  preserveColor = false,
  display = '',
}: SectionProps) => {
  let custom = false;
  let classBuffer = 'uk-section';
  let classBuffer2 = 'uk-container';
  if (className?.includes('custom')) {
    custom = true;
  } else {
    if (style) classBuffer += ` uk-section-${style}`;
    if (size) classBuffer += ` uk-section-${size}`;
    if (className) classBuffer += ` ${className}`;
    if (preserveColor) classBuffer += ` uk-preserve-color`;

    if (container) classBuffer2 += ` uk-container-${container}`;
  }

  return custom ? (
    <StyledSection className={className}>
      <div className={`${display} section-container`}>{children}</div>
    </StyledSection>
  ) : (
    <div className={classBuffer} id={id}>
      <div className={classBuffer2}>{children}</div>
    </div>
  );
};
