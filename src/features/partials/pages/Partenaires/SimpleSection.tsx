import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { SECTION_STYLES } from '@/src/components/variables';
import {
  StyledCenteredSubtitleH3,
  StyledCenteredSubtitleH4,
  StyledCenteredTitleH2Medium,
} from '@/src/features/partials/common/PageText';
import {
  StyledSimpleSectionContent,
  StyledSimpleSectionTitle,
} from './SimpleSection.styles';

interface SimpleSectionProps {
  id: string;
  style?: SECTION_STYLES;

  container?: 'small' | 'large';
  title: React.ReactNode;
  button?: {
    label: string;
    href?: string;
    external?: boolean;
    modal?: string;
    onClick?: () => void;
  };
  text: React.ReactNode;
  children?: React.ReactNode;
  fontSize?: 'small' | 'large';
}

export const SimpleSection = ({
  id,
  style,
  container,
  title,
  text,
  button,
  children,
  fontSize,
}: SimpleSectionProps) => {
  return (
    <Section container={container} style={style}>
      {/* Fix so that the anchor scroll to the right height */}
      <div id={id} style={{ marginTop: -140, paddingTop: 140 }} />
      <StyledSimpleSectionContent>
        <StyledSimpleSectionTitle>
          <StyledCenteredTitleH2Medium>{title}</StyledCenteredTitleH2Medium>
        </StyledSimpleSectionTitle>
        {fontSize === 'small' ? (
          <StyledCenteredSubtitleH4>{text}</StyledCenteredSubtitleH4>
        ) : (
          <StyledCenteredSubtitleH3>{text}</StyledCenteredSubtitleH3>
        )}
        {button && (
          <Button
            href={button.href}
            variant="primary"
            isExternal={button.external}
            newTab={button.external}
            onClick={button.onClick}
          >
            {button.label}
            <LucidIcon name="ChevronRight" />
          </Button>
        )}
        {children}
      </StyledSimpleSectionContent>
    </Section>
  );
};

SimpleSection.defaultProps = {
  style: 'default',
  container: 'small',
  button: null,
  children: null,
  fontSize: 'large',
};
