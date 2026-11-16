import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { COLORS } from '@/src/constants/styles';
import { StyledDashSpinner } from './Spinner.styles';

interface SpinnerProps {
  color?: string;
  size?: number | string;
  /**
   * `circle`: a ring with a gap (default).
   * `dash`: a thin circle whose arc grows and shrinks, in the color of the surrounding text,
   * 30px wide unless `size` says otherwise.
   */
  variant?: 'circle' | 'dash';
}

export const Spinner = ({ color, size, variant = 'circle' }: SpinnerProps) => {
  if (variant === 'dash') {
    const side = size ?? 30;
    return (
      <StyledDashSpinner role="status" aria-label="Chargement">
        <svg width={side} height={side} viewBox="0 0 30 30">
          <circle fill="none" cx="15" cy="15" r="14" />
        </svg>
      </StyledDashSpinner>
    );
  }
  return <ClipLoader color={color || COLORS.primaryBlue} size={size} />;
};
