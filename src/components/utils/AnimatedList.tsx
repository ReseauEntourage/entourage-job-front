import React from 'react';

export const AnimatedList = ({ items }: { items: React.ReactNode[] }) => {
  return (
    <ul
      data-uk-scrollspy="cls:uk-animation-slide-bottom; target: > li; delay: 200;"
      className="uk-list uk-list-disc uk-margin-remove-bottom"
    >
      {items.map((item, index) => {
        return (
          <li className="uk-text-primary" key={index}>
            <span className="uk-text-secondary">{item}</span>
          </li>
        );
      })}
    </ul>
  );
};
