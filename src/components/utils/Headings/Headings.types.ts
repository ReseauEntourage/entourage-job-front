export const FONT_WEIGHTS = {
  lighter: 'lighter',
  normal: 'normal',
  semibold: '500',
  bold: 'bold',
};

export type WeightProps = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];

interface HeadingBasicProps {
  color?: string;
  center?: boolean;
  weight?: WeightProps;
}

export interface HeadingComponentProps extends HeadingBasicProps {
  title: React.ReactNode;
  variant?: 'big' | '';
}

export interface StyledHeadingProps extends HeadingBasicProps {
  mobile?: boolean;
}
