import { styled } from 'styled-components';

export const StyledShareCVColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledShareCVQuestion = styled.p`
  flex: 1;
  text-align: center !important;
  margin-top: 40px !important;
`;

export const StyledShareCVRow = styled.div<{ $spaced?: boolean }>`
  display: flex;
  justify-content: center;
  ${({ $spaced }) => $spaced && 'margin-top: 40px !important;'}
`;

export const StyledShareCVCloseRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 40px !important;
`;
