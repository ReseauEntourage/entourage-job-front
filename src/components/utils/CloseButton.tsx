import dynamic from 'next/dynamic';
import React from 'react';

interface CloseButtonProps {
  className?: string;
  onClick?: () => void;
  dataTestId?: string;
}

export const CloseButton = ({
  className,
  onClick,
  dataTestId,
}: CloseButtonProps) => {
  return (
    <button
      className={className || 'uk-offcanvas-close'}
      type="button"
      data-uk-close
      aria-label="close"
      onClick={onClick}
      data-testid={dataTestId}
    />
  );
};

CloseButton.defaultProps = {
  className: null,
  onClick: null,
  dataTestId: '',
};
