import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

export const StyledTopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledIcon = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px ${COLORS.gray} solid;
  color: ${COLORS.gray};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledTitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const StyledTitle = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledCompany = styled.div`
  text-overflow: ellipsis;
`;

export const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
`;

export const StyledBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledDescription = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  color: ${COLORS.black};
`;
