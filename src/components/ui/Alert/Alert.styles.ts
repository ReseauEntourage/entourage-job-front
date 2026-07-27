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
  $center?: boolean;
}>`
  display: ${(props) => {
    return props.$visible ? 'flex' : 'none';
  }};
  border: 1px ${(props) => (props.$variant === 'dashed' ? 'dashed' : 'solid')}
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
  justify-content: ${(props) => (props.$center ? 'center' : 'flex-start')};

  &:hover {
    filter: ${(props) => (props.$clickable ? 'brightness(0.95)' : 'none')};
  }

  &:active {
    filter: ${(props) => (props.$clickable ? 'brightness(0.9)' : 'none')};
  }
`;

export const StyledAlertContainer = styled.div<{
  $center?: boolean;
}>`
  /* Kept at flex: 1 by default so the container fills the row and pushes a
     closable alert's close button to the far edge. When centering, it must
     NOT grow — otherwise it eats all the row's free space and the outer
     row's justify-content: center has nothing left to center against,
     leaving the icon pinned to the left of a centered text block. */
  flex: ${(props) => (props.$center ? '0 1 auto' : '1')};
  ${(props) =>
    props.$center &&
    `
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    `}
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
