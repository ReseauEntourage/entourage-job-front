import React from 'react';
import { Button, Section } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { UIKIT_STYLES } from 'src/components/variables';

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
          <h2 className="uk-text-bold uk-align-center uk-text-center uk-margin-medium-bottom uk-margin-remove-top">
            {title}
          </h2>
        </div>
        {fontSize === 'small' ? (
          <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
            {text}
          </h4>
        ) : (
          <h3 className="uk-align-center uk-text-center uk-margin-large-bottom">
            {text}
          </h3>
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
