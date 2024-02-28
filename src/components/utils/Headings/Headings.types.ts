export type WeightProps = 'normal' | 'bold' | 'lighter';

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
