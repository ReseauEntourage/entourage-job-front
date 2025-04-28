import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledMessageMedia = styled.div`
  background: ${COLORS.white};
  padding: 5px;
  display: flex;
  border-radius: 5px;
  gap: 5px;
  align-items: center;
  cursor: pointer;
`;

export const StyledPreviewerContainer = styled.div`
  width: 250px;
  height: 200px;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
`;
