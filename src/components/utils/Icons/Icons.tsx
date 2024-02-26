/* eslint-disable import/namespace */
// this rule is disabled because "All" import sends an error

import React from 'react';
import * as All from 'assets/icons/icons';
import { StyledIconsContainer, StyledIconContainer } from './Icons.styles';

export const Icons = () => {
  const isComponent = (key) =>
    typeof All[key] === 'function' && /^\w+$/.test(key);

  const renderComponents = () => {
    return Object.keys(All)
      .filter(isComponent)
      .map((key, index) => {
        const Component = All[key];
        return (
          <StyledIconContainer>
            <p>{key}</p>
            <Component key={index} />
          </StyledIconContainer>
        );
      });
  };
  return <StyledIconsContainer>{renderComponents()}</StyledIconsContainer>;
};
