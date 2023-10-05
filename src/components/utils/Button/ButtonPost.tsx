import React, { FormEvent, useState } from 'react';
import { Button, Icon } from 'src/components/utils';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';
import { StyledButtonPostContainer } from './ButtonPost.styles';

interface ButtonPostProps {
  text: string;
  color?: string;
  action?: (event?: FormEvent) => Promise<void>;
  style?: '' | UIKIT_BUTTON_STYLES_SPEC;
  icon?: string;
  disabled?: boolean;
  dataTestId?: string;
}

export const ButtonPost = ({
  text,
  icon,
  action,
  style,
  color,
  disabled,
  dataTestId,
}: ButtonPostProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={disabled || loading}
      style={style}
      dataTestId={dataTestId}
      color={color}
      onClick={async () => {
        if (!loading) {
          setLoading(true);
          try {
            await action();
          } finally {
            setLoading(false);
          }
        }
      }}
    >
      <StyledButtonPostContainer>
        {text}
        {loading ? (
          <div data-uk-spinner="ratio: .5" />
        ) : (
          icon && <Icon name={icon} ratio={0.8} />
        )}
      </StyledButtonPostContainer>
    </Button>
  );
};
