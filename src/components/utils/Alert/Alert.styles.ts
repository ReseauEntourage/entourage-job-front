import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';
import { AlertVariant } from './Alert.types';

export const StyledAlert = styled.div<{
  variant: AlertVariant;
  visible: boolean;
  rounded: boolean;
}>`
  display: ${(props) => {
    return props.visible ? 'flex' : 'none';
  }};
  align-items: center;
  gap: 10px;
  border-radius: ${(props) => {
    return props.rounded ? '10px' : '0';
  }};
  background-color: ${(props) => {
    return COLORS.alert[props.variant]?.background || COLORS.white;
  }};
  color: ${(props) => {
    return COLORS.alert[props.variant]?.text || COLORS.white;
  }};
  padding: 10px 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 14px 20px;
  }
  p {
    margin: 0;
  }
`;

export const StyledAlertContainer = styled.div`
  flex: 1;
`;
