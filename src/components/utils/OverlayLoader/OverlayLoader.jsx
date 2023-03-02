import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function OverlayLoader() {
  return (
    <Container>
      <div data-uk-spinner="ratio: .8" />
    </Container>
  );
}
