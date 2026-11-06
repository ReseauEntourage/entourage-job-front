import React from 'react';
import { Button, Section } from '@/src/components/ui';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { UIKIT_STYLES } from '@/src/components/variables';
import {
  StyledCenteredSubtitleH3,
  StyledCenteredSubtitleH4,
  StyledCenteredTitleH2Medium,
} from '@/src/features/partials/common/PageText';

interface SimpleSectionProps {
  id: string;
  style?: UIKIT_STYLES;

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
      <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <div className="uk-container-small">
          <StyledCenteredTitleH2Medium>{title}</StyledCenteredTitleH2Medium>
        </div>
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
      </div>
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
