import React from 'react';
import { StyledModalFooter } from './ModalFooter.styles';

interface ModalFooterProps {
  children: React.ReactNode;
}

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return <StyledModalFooter>{children}</StyledModalFooter>;
};
