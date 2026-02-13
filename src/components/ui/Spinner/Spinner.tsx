import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { COLORS } from 'src/constants/styles';

interface SpinnerProps {
  color?: string;
  size?: number | string;
}

export const Spinner = ({ color, size }: SpinnerProps) => {
  return <ClipLoader color={color || COLORS.primaryBlue} size={size} />;
};
