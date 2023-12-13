import React, { FormEvent, useState } from 'react';
import { Button } from 'src/components/utils';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';
import { StyledButtonPostContainer } from './ButtonPost.styles';

interface ButtonPostProps {
  text: string;
  color?: string;
  action?: (event?: FormEvent) => Promise<void>;
  style?: '' | UIKIT_BUTTON_STYLES_SPEC;
  icon?: JSX.Element;
  disabled?: boolean;
  isLoadingOverride?: boolean;
  dataTestId?: string;
}

export const ButtonPost = ({
  text,
  icon,
  action,
  style,
  color,
  disabled,
  isLoadingOverride,
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
          await // @ts-expect-error after enable TS strict mode. Please, try to fix it
          action();
          setLoading(false);
        }
      }}
    >
      <StyledButtonPostContainer>
        {text}
        {loading || isLoadingOverride ? (
          <div data-uk-spinner="ratio: .5" />
        ) : (
          icon && <>&nbsp;{icon}</>
        )}
      </StyledButtonPostContainer>
    </Button>
  );
};
