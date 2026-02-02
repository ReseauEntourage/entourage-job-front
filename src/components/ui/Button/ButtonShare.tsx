import React, { useCallback } from 'react';
import { Button } from './Button';
import { ButtonProps } from './Button.types';

export interface ButtonShareProps extends ButtonProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  url: string;
}

export const ButtonShare = ({
  children,
  title,
  description,
  url,
  ...props
}: ButtonShareProps) => {
  // States
  const [copied, setCopied] = React.useState(false);

  // Callbacks
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const onShare = useCallback(() => {
    const canShare = !!navigator.share;

    if (canShare) {
      navigator.share({
        title,
        text: description,
        url,
      });
    } else {
      onCopy();
    }
  }, [description, title, url, onCopy]);

  // Render
  return (
    <Button onClick={onShare} {...props}>
      {copied ? 'Lien copié !' : children}
    </Button>
  );
};
