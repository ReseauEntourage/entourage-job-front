import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Icon = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px ${COLORS.gray} solid;
  color: ${COLORS.gray};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const Title = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Company = styled.div`
  text-overflow: ellipsis;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Description = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
  color: ${COLORS.black};
`;
