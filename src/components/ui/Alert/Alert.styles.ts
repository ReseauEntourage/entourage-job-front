import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';
import { AlertType, AlertVariant } from './Alert.types';

export const ALERT_COLORS = {
  [AlertType.Info]: {
    mainColor: 'primaryBlue',
    lightColor: 'hoverBlue',
    title: 'black',
    text: 'extraDarkGray',
  },
  [AlertType.Neutral]: {
    mainColor: 'lightGray',
    lightColor: 'gray',
    title: 'black',
    text: 'black',
  },
  [AlertType.Info2]: {
    mainColor: 'darkBlue',
    lightColor: 'blue',
    title: 'white',
    text: 'white',
  },
  [AlertType.Error]: {
    mainColor: 'red',
    lightColor: 'extraLightRed',
    title: 'white',
    text: 'white',
  },
  [AlertType.NeutralWhite]: {
    mainColor: 'white',
    lightColor: 'gray',
    title: 'black',
    text: 'black',
  },
  [AlertType.Success]: {
    mainColor: 'extraLightGreen',
    lightColor: 'green',
    title: 'black',
    text: 'black',
  },
  [AlertType.Warning]: {
    mainColor: 'orangeLocal',
    lightColor: 'extraLightAmber',
    title: 'black',
    text: 'amber',
  },
};

export const StyledAlert = styled.div<{
  $variant: AlertVariant;
  $type: AlertType;
  $visible: boolean;
  $rounded: boolean;
  $clickable?: boolean;
}>`
  display: ${(props) => {
    return props.$visible ? 'flex' : 'none';
  }};
  border: 1px solid
    ${(props) => {
      return props.$variant === 'filled'
        ? COLORS.transparent
        : COLORS[ALERT_COLORS[props.$type]?.mainColor] || COLORS.transparent;
    }};
  align-items: center;
  gap: 15px;
  border-radius: ${(props) => {
    return props.$rounded ? '10px' : '0';
  }};
  background-color: ${(props) => {
    return props.$variant === 'filled'
      ? COLORS[ALERT_COLORS[props.$type]?.mainColor] || COLORS.white
      : COLORS[ALERT_COLORS[props.$type]?.lightColor] || COLORS.transparent;
  }};
  color: ${(props) => COLORS[ALERT_COLORS[props.$type]?.text]};
  padding: 10px 20px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 14px 20px;
  }

  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};
  transition: ${(props) => (props.$clickable ? 'filter 0.2s' : 'none')};

  &:hover {
    filter: ${(props) => (props.$clickable ? 'brightness(0.95)' : 'none')};
  }

  &:active {
    filter: ${(props) => (props.$clickable ? 'brightness(0.9)' : 'none')};
  }
`;

export const StyledAlertContainer = styled.div`
  flex: 1;
`;

export const StyledIconContainer = styled.div<{
  $iconInContainer: boolean;
}>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  ${(props) =>
    props.$iconInContainer
      ? `
    background: ${COLORS.white};
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.08);
  `
      : ''};
`;
