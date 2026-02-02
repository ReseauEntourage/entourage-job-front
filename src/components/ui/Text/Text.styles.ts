import styled from 'styled-components';
import { COLORS, FONT_WEIGHTS } from 'src/constants/styles';
import { TextProps } from './Text.types';
import { LINE_HEIGHT_MULTIPLIER } from './Text.utils';

export const StyledText = styled.div<TextProps>`
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
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'inherit')};
`;
