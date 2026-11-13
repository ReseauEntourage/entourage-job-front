import { styled } from 'styled-components';

/** Centered column holding the title, the text and the button of the section. */
export const StyledSimpleSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

/** Title wrapper: its width is capped, but it is not centered. */
export const StyledSimpleSectionTitle = styled.div`
  max-width: 900px;
`;
