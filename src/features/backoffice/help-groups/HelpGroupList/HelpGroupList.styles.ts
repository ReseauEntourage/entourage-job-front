import { styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledHelpGroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const StyledHelpGroupsCatalog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    gap: 24px;
  }
`;

export const StyledHelpGroupsIntro = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px 48px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const StyledHelpGroupsIntroText = styled.div`
  flex: 1 1 520px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex: none;
    gap: 8px;
  }
`;

export const StyledHelpGroupsOverline = styled.div`
  letter-spacing: 0.08em;
`;

export const StyledHelpGroupsIntroLead = styled.div`
  max-width: 640px;
`;
