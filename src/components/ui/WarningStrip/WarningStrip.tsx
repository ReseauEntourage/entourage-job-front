import React from 'react';
import { StyledWarningStrip } from './WarningStrip.styles';

export const WarningStrip = ({ children }: { children: React.ReactNode }) => {
  return <StyledWarningStrip>{children}</StyledWarningStrip>;
};
