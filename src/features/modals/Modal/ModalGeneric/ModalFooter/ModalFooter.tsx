import React from 'react';
import { StyledModalFooter } from './ModalFooter.styles';

interface ModalFooterProps {
  children: React.ReactNode;
  /**
   * `centered`: actions grouped in the middle, inside the modal body.
   * `spread`: one action at each end, below the scrolling body, with its own
   * gutters and a separating rule; actions stack on mobile.
   */
  layout?: 'centered' | 'spread';
}

export const ModalFooter = ({
  children,
  layout = 'centered',
}: ModalFooterProps) => {
  return <StyledModalFooter $layout={layout}>{children}</StyledModalFooter>;
};
