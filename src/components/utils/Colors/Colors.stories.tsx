import React from 'react';

import { ALERT_COLORS, COLORS } from 'src/constants/styles';
import {
  StyledColor,
  StyledColorContainer,
  StyledColorsContainer,
} from './Colors.styles';

const meta = {
  title: 'Colors',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const DarkColors = [
  'darkGray',
  'mediumGray',
  'black',
  'red',
  'darkOrange',
  '#A0A0A0',
];

const ColorsTemplate = () => {
  return (
    <div>
      <h3>Colors: click to copy</h3>
      <h4>Main Colors</h4>
      <StyledColorsContainer>
        {Object.keys(COLORS).map((colorKey) => {
          const isDarkColor = DarkColors.includes(colorKey);
          return (
            <StyledColorContainer
              onClick={() => {
                navigator.clipboard.writeText(COLORS[colorKey]);
                alert(`Copied: ${COLORS[colorKey]}`); // eslint-disable-line no-alert
              }}
            >
              <StyledColor color={COLORS[colorKey]} isDarkColor={isDarkColor}>
                {COLORS[colorKey]}
              </StyledColor>
              <div>{colorKey}</div>
            </StyledColorContainer>
          );
        })}
      </StyledColorsContainer>
      <h4>Alert Colors</h4>
      <StyledColorsContainer>
        {Object.keys(ALERT_COLORS).map((colorKey) => {
          return (
            <StyledColorContainer
              onClick={() => {
                navigator.clipboard.writeText(
                  ALERT_COLORS[colorKey].background
                );
                alert(`Copied: ${ALERT_COLORS[colorKey].background}`); // eslint-disable-line no-alert
              }}
            >
              <StyledColor color={ALERT_COLORS[colorKey].background}>
                {ALERT_COLORS[colorKey].background}
              </StyledColor>
              <div>{colorKey}</div>
            </StyledColorContainer>
          );
        })}
      </StyledColorsContainer>
    </div>
  );
};

export const Colors = {
  render: ColorsTemplate,
};

export default meta;
