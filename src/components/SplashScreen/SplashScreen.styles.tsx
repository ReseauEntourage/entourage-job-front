import styled from 'styled-components';

export interface SplashScreenProps {
  loading: boolean;
  fading: boolean;
}
export const StyledSplashScreenContainer = styled.div<SplashScreenProps>`
  height: 100vh;
  z-index: 9999;
  visibility: ${(props) => (props.loading ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.loading ? '100%' : '0%')};
  transition: 0.3s ease-in-out;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;
