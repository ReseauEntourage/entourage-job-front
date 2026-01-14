import styled from 'styled-components';
import { ALERT_COLORS, BREAKPOINTS, COLORS } from 'src/constants/styles';
import { AlertVariant } from './Alert.types';

export const StyledAlert = styled.div<{
  variant: AlertVariant;
  visible: boolean;
  rounded: boolean;
  clickable?: boolean;
}>`
  display: ${(props) => {
    return props.visible ? 'flex' : 'none';
  }};
  border: 1px solid
    ${(props) => {
      return ALERT_COLORS[props.variant]?.border || COLORS.transparent;
    }};
  align-items: center;
  gap: 10px;
  border-radius: ${(props) => {
    return props.rounded ? '10px' : '0';
  }};
  background-color: ${(props) => {
    return ALERT_COLORS[props.variant]?.background || COLORS.white;
  }};
  color: ${(props) => {
    return ALERT_COLORS[props.variant]?.text || COLORS.black;
  }};
  color: ${(props) => ALERT_COLORS[props.variant]?.text};
  padding: 10px 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 14px 20px;
  }
  p {
    margin: 0;
  }

  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};
  transition: ${(props) => (props.clickable ? 'filter 0.2s' : 'none')};

  &:hover {
    filter: ${(props) => (props.clickable ? 'brightness(0.95)' : 'none')};
  }

  &:active {
    filter: ${(props) => (props.clickable ? 'brightness(0.9)' : 'none')};
  }
`;

export const StyledAlertContainer = styled.div`
  flex: 1;
`;
