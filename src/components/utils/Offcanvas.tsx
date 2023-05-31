import dynamic from 'next/dynamic';
import React from 'react';

import { CloseButton } from 'src/components/utils/CloseButton.tsx';

interface OffcanvasProps {
  id: string;
  children: React.ReactNode;
  container?: boolean;
  flip?: boolean;
  className?: string;
}

const Offcanvas = ({
  id,
  children,
  container,
  flip,
  className,
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

Offcanvas.defaultProps = {
  container: undefined,
  flip: true,
  className: '',
};

export const OffcanvasNoSSR = dynamic(
  () => {
    return import('src/components/utils/Offcanvas');
  },
  {
    ssr: false,
  }
);

export default Offcanvas;
