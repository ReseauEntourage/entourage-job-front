import React, { FormEvent, useState, type JSX } from 'react';
import { Button } from 'src/components/utils';
import { StyledButtonPostContainer } from './ButtonPost.styles';

interface ButtonPostProps {
  text: string;
  action?: (event?: FormEvent) => Promise<void>;
  variant?: 'default' | 'primary' | 'secondary';
  icon?: JSX.Element;
  disabled?: boolean;
  isLoadingOverride?: boolean;
  dataTestId?: string;
}

export const ButtonPost = ({
  text,
  icon,
  action,
  variant,
  disabled,
  isLoadingOverride,
  dataTestId,
}: ButtonPostProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={disabled || loading}
      variant={variant}
      dataTestId={dataTestId}
      onClick={async () => {
        if (!loading) {
          setLoading(true);
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          await action();
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
