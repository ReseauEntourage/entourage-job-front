import React from 'react';
import { FONT_WEIGHTS } from '@/src/constants/styles';

type WeightProps = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];

interface HeadingBasicProps {
  color?: string;
  center?: boolean;
  weight?: WeightProps;
}

export interface HeadingComponentProps extends HeadingBasicProps {
  title: React.ReactNode;
  variant?: 'big' | '';
  noMarginBottom?: boolean;
  // H1 only: 24px on desktop and 20px on mobile, for a page title that must
  // leave room for the content below it on a small screen
  compact?: boolean;
}

export interface StyledHeadingProps {
  color?: string;
  $center?: boolean;
  $weight?: WeightProps;
  $mobile?: boolean;
  $noMarginBottom?: boolean;
  $compact?: boolean;
}
