import { styled } from 'styled-components';
import { Color, COLORS, FONT_WEIGHTS } from 'src/constants/styles';
import { TextProps, TextWeight } from './Text.types';
import { LINE_HEIGHT_MULTIPLIER } from './Text.utils';

// `size`, `weight` and `color` are always resolved to a concrete value by
// Text.tsx (via default params) before being forwarded here, so they're
// declared as required for this styled component even though TextProps
// keeps them optional for the public Text component API.
type StyledTextProps = Omit<TextProps, 'size' | 'weight' | 'color'> & {
  size: number;
  weight: TextWeight;
  color: Color;
};

export const StyledText = styled.div<StyledTextProps>`
  padding: 0;
  margin: 0;
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  font-size: ${({ size }) => size}px;
  line-height: ${({ size }) => size * LINE_HEIGHT_MULTIPLIER}px;
  color: ${({ color }) => COLORS[color]};
  font-style: ${({ variant }) => variant === 'italic' && 'italic'};
  font-style: ${({ variant }) => variant === 'normal' && 'normal'};
  text-decoration: ${({ variant }) => variant === 'underline' && 'underline'};
  text-align: ${({ center, textAlign }) => (center ? 'center' : textAlign)};
  text-decoration: ${({ underline }) => (underline ? 'underline' : 'none')};
  text-transform: ${({ uppercase }) => (uppercase ? 'uppercase' : 'none')};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'inherit')};
`;
