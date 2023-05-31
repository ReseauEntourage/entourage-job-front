import React from 'react';

interface DropdownProps {
  children: React.ReactNode;
  headers?: number[];
  dividers?: number[];
  active?: number;
  id?: string;
  boundaryId?: string;
}

export const Dropdown = ({
  children,
  headers,
  dividers,
  active,
  id,
  boundaryId,
}: DropdownProps) => {
  return (
    <div
      id={id}
      style={{ minWidth: '10px' }}
      data-uk-dropdown={`mode: click; pos: bottom-justify; ${
        boundaryId ? `boundary: #${boundaryId}; boundary-align: true ` : ''
      }`}
    >
      <ul className="uk-nav uk-navbar-dropdown-nav">
        {(Array.isArray(children) ? children : [children]).map((item, key) => {
          const classBuffer = [];
          if (active === key) classBuffer.push('uk-active');
          if (dividers.includes(key)) classBuffer.push('uk-nav-divider');
          if (headers.includes(key)) classBuffer.push('uk-nav-header');
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

Dropdown.defaultProps = {
  headers: [],
  dividers: [],
  active: undefined,
  id: 'dropdown',
  boundaryId: undefined,
};

export const DropdownNoSSR = Dropdown;
