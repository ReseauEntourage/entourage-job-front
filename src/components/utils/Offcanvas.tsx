import dynamic from 'next/dynamic';
import React from 'react';

import CloseButton from 'src/components/utils/CloseButton';

interface OffcanvasType {
  id: string;
  children: JSX.Element[] | JSX.Element;
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
}: OffcanvasType) => {
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
