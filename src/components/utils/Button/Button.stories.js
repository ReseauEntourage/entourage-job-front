import React from 'react';
import styled from 'styled-components';
import { COLORS } from '../../../constants/styles';

import Button from '.';

const StyledDarkBG = styled.div`
  height: 100px;
  width: 500px;
  padding: 50px;
  background-color: ${COLORS.darkerBlack};
`;

export default {
  title: 'Button',
  parameters: {
    component: null,
  },
};

export function PrimaryOrange() {
  return (
    <Button style="custom-primary" href="/">
      Button
    </Button>
  );
}

export function PrimaryInvertedWhite() {
  return (
    <StyledDarkBG>
      <Button style="custom-primary-inverted" color="white">
        Button
      </Button>
    </StyledDarkBG>
  );
}

export function PrimaryInvertedOrange() {
  return (
    <Button style="custom-primary-inverted" color="primaryOrange">
      Button
    </Button>
  );
}

export function PrimaryInvertedGray() {
  return (
    <Button style="custom-primary-inverted" color="darkGrayFont">
      Button
    </Button>
  );
}

export function SecondaryOrange() {
  return (
    <Button style="custom-secondary" color="primaryOrange">
      Button
    </Button>
  );
}

export function ButtonDisabled() {
  return (
    <Button style="custom-secondary disabled" color="primaryOrange">
      Button
    </Button>
  );
}
