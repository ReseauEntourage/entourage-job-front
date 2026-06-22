import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledCvContentFormContainer = styled.div<{
  $disabled?: boolean;
}>`
  position: relative;
  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${COLORS.overlayWhite};
    display: ${({ $disabled }) => ($disabled ? 'block' : 'none')};
    z-index: 1;
  }
`;

export const StyledExperienceOrFormationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
`;

export const StyledExperienceOrFormationFormFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledExperienceOrFormationFormFieldLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const StyledAlertImportCVContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
`;
