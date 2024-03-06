import React from 'react';

import { COLORS } from 'src/constants/styles';
import {
  StyledColor,
  StyledColorContainer,
  StyledColorsContainer,
  StyledStatusColor,
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
  'darkGrayFont',
  'darkGray',
  'black',
  'noRed',
  'warningOrange',
  '#A0A0A0',
];

const ColorsTemplate = () => {
  return (
    <div>
      <h3>Colors: click to copy</h3>
      <h4>Main Colors</h4>
      <StyledColorsContainer>
        {Object.keys(COLORS).map((colorKey) => {
          if (colorKey === 'cvStatus') return null;
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
      <h4>Status Colors (with borders)</h4>
      <StyledColorsContainer>
        {Object.keys(COLORS.cvStatus).map((colorKey) => {
          const isDarkColor = DarkColors.includes(
            COLORS.cvStatus[colorKey].background
          );
          return (
            <StyledColorContainer
              onClick={() => {
                navigator.clipboard.writeText(
                  COLORS.cvStatus[colorKey].background
                );
                alert(`Copied: ${COLORS.cvStatus[colorKey].background}`); // eslint-disable-line no-alert
              }}
            >
              <StyledStatusColor
                color={COLORS.cvStatus[colorKey].background}
                isDarkColor={isDarkColor}
                borderColor={COLORS.cvStatus[colorKey].border}
              >
                {COLORS.cvStatus[colorKey].background}
              </StyledStatusColor>
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
