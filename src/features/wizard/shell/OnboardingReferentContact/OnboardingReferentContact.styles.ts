import { styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

// Desktop only: on mobile the help link takes over.
export const StyledOnboardingReferentContact = styled.div`
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;

export const StyledOnboardingReferentContactBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const StyledOnboardingReferentContactPicture = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
`;

export const StyledOnboardingReferentContactText = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 0;
  }
`;
