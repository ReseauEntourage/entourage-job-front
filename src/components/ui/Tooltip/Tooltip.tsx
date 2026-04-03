import React, { useState } from 'react';
import { StyledTooltipContent, StyledTooltipWrapper } from './Tooltip.styles';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}

export const Tooltip = ({ content, children, width }: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledTooltipWrapper
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <StyledTooltipContent width={width}>{content}</StyledTooltipContent>
      )}
    </StyledTooltipWrapper>
  );
};
