import React from 'react';

import { CloseButton } from 'src/components/utils/CloseButton/CloseButton';

interface OffcanvasProps {
  id: string;
  children: React.ReactNode;
  container?: boolean;
  flip?: boolean;
  className?: string;
}

export const Offcanvas = ({
  id,
  children,
  container,
  flip = true,
  className = '',
}: OffcanvasProps) => {
  return (
    <div
      data-uk-offcanvas={`overlay: true; flip: ${flip}; ${
        container ? 'container: true' : ''
      }`}
      id={id}
    >
      <div className={`uk-offcanvas-bar ${className}`}>
        <CloseButton />
        {children}
      </div>
    </div>
  );
};
