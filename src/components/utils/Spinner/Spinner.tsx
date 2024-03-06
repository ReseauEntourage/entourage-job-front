import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { COLORS } from 'src/constants/styles';

interface SpinnerProps {
  color?: string;
}

export const Spinner = ({ color }: SpinnerProps) => {
  return <ClipLoader size={20} color={color || COLORS.primaryBlue} />;
};
