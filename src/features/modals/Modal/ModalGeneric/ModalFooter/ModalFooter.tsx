import React from 'react';
import { ModalFooterLayout, StyledModalFooter } from './ModalFooter.styles';

interface ModalFooterProps {
  children: React.ReactNode;
  /**
   * `centered`: actions grouped in the middle, inside the modal body.
   * `spread`: one action at each end, below the scrolling body, with its own
   * gutters and a separating rule; actions stack on mobile.
   * `end`: same place as `spread`, actions grouped on the right; on mobile
   * they share one row, the last one (the main action) twice as wide.
   */
  layout?: ModalFooterLayout;
}

export const ModalFooter = ({
  children,
  layout = 'centered',
}: ModalFooterProps) => {
  return <StyledModalFooter $layout={layout}>{children}</StyledModalFooter>;
};
