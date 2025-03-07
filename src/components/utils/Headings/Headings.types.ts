import { FONT_WEIGHTS } from 'src/constants/styles';

export type WeightProps = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];

interface HeadingBasicProps {
  color?: string;
  center?: boolean;
  weight?: WeightProps;
}

export interface HeadingComponentProps extends HeadingBasicProps {
  title: React.ReactNode;
  effect?: string;
  variant?: 'big' | '';
}

export interface StyledHeadingProps extends HeadingBasicProps {
  mobile?: boolean;
}
