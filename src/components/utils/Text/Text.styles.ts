import styled from 'styled-components';
import { COLORS, FONT_WEIGHTS } from 'src/constants/styles';
import { TextProps } from './Text.types';

export const StyledText = styled.div<TextProps>`
  padding: 0;
  margin: 0;
  font-weight: ${(props) => FONT_WEIGHTS[props.weight]};
  font-size: ${({ size }) => size}px;
  line-height: ${({ size }) => size * 1.5}px;
  color: ${({ color }) => COLORS[color]};
  font-style: ${({ variant }) => variant === 'italic' && 'italic'};
  font-style: ${({ variant }) => variant === 'normal' && 'normal'};
  text-decoration: ${({ variant }) => variant === 'underline' && 'underline'};
  text-align: ${({ center }) => (center ? 'center' : 'left')};
`;
