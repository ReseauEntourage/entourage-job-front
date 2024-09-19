import React from 'react';

interface DropdownProps {
  children: React.ReactNode;
  headers?: number[];
  dividers?: number[];
  active?: number;
  id?: string;
  boundaryId?: string;
}

/**
 * Dropdown component (using UIKit)
 * @deprecated This component is deprecated. Please use the Dropdown component in the ./Dropdown folder
 */
export const Dropdown = ({
  id = 'dropdown',
  children,
  active,
  boundaryId,
  headers = [],
  dividers = [],
}: DropdownProps) => {
  return (
    <div
      id={id}
      data-uk-dropdown={`mode: click; pos: bottom-justify; ${
        boundaryId ? `boundary: #${boundaryId}; boundary-align: true ` : ''
      }`}
    >
      <ul className="uk-nav uk-navbar-dropdown-nav">
        {(Array.isArray(children) ? children : [children]).map((item, key) => {
          const classBuffer = [];
          if (active === key) {
            classBuffer.push(
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              'uk-active'
            );
          }
          if (dividers.includes(key)) {
            classBuffer.push(
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              'uk-nav-divider'
            );
          }
          if (headers.includes(key)) {
            classBuffer.push(
              // @ts-expect-error after enable TS strict mode. Please, try to fix it
              'uk-nav-header'
            );
          }
          return (
            <li key={key} className={classBuffer.join(' ')}>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
