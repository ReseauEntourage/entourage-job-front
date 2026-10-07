import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

/**
 * Two columns on desktop: the header then the discussions on the left,
 * « À propos de ce groupe » then « Le cadre » on the right. « À propos »
 * spans the first two rows, so that « Le cadre » follows it whatever the
 * height of the header. One column on mobile, in the order of the DOM.
 */
export const StyledHelpGroupPage = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'header about'
    'main about'
    'main charter';
  align-items: start;
  column-gap: 32px;
  row-gap: 24px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
    grid-template-areas:
      'header'
      'about'
      'main'
      'charter';
  }
`;

export const StyledHelpGroupPageHeader = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledHelpGroupPageMain = styled.div`
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const StyledHelpGroupPageCharter = styled.div`
  grid-area: charter;
`;

export const StyledHelpGroupAbout = styled.section`
  grid-area: about;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  background-color: ${COLORS.white};
`;

export const StyledHelpGroupHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledUnpublishedMention = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 12px;
  background-color: ${COLORS.lightYellow};
  color: ${COLORS.amber};
  font-size: 12px;
  font-weight: 600;
`;

export const StyledHelpGroupCharter = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px;
  border-radius: 20px;
  background-color: ${COLORS.hoverBlue};
`;

export const StyledHelpGroupCharterRules = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledDiscussionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledDiscussionListEmpty = styled.div`
  padding: 40px 0;
  text-align: center;
`;
