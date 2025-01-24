import styled from 'styled-components';
import { FONT_WEIGHTS } from '../Headings/Headings.types';
import { COLORS } from 'src/constants/styles';
import { TextProps } from './Text.types';

const sizes = {
  desktop: {
    small: 12,
    normal: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 20,
  },
  mobile: {
    small: 12,
    normal: 13,
    large: 14,
    xlarge: 16,
    xxlarge: 18,
  },
};

export const StyledText = styled.div<TextProps>`
  padding: 0;
  margin: 0;
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  font-size: ${(props) => (props.mobile ? '14px' : '16px')};
  font-size: ${(props) =>
    sizes[props.mobile ? 'mobile' : 'desktop'][props.size]}px;
  line-height: ${(props) =>
    sizes[props.mobile ? 'mobile' : 'desktop'][props.size] * 1.5}px;
  color: ${({ color }) => COLORS[color]};
  font-style: ${({ variant }) => variant};
  text-align: ${({ center }) => (center ? 'center' : 'left')};
`;
