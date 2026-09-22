import React from 'react';
import { StyledModalFooter } from './ModalFooter.styles';

interface ModalFooterProps {
  children: React.ReactNode;
  /**
   * `centered` : les actions groupées au centre, dans le corps de la modale.
   * `spread` : une action à chaque bout, sous le corps défilant, avec ses
   * gouttières et un filet de séparation ; les actions s'empilent sur mobile.
   */
  layout?: 'centered' | 'spread';
}

export const ModalFooter = ({
  children,
  layout = 'centered',
}: ModalFooterProps) => {
  return <StyledModalFooter $layout={layout}>{children}</StyledModalFooter>;
};
