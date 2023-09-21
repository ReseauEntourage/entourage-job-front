import React, { FormEvent, useState } from 'react';
import { Button, Icon } from 'src/components/utils';
import { UIKIT_BUTTON_STYLES_SPEC } from 'src/components/variables';

interface ButtonPostProps {
  text: string;
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
  disabled,
  dataTestId,
}: ButtonPostProps) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={disabled || loading}
      style={style}
      dataTestId={dataTestId}
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
      <div className="uk-flex uk-flex-middle">
        {text}
        {loading ? (
          <div className="uk-margin-small-left" data-uk-spinner="ratio: .5" />
        ) : (
          icon && (
            <Icon className="uk-margin-small-left" name={icon} ratio={0.8} />
          )
        )}
      </div>
    </Button>
  );
};
