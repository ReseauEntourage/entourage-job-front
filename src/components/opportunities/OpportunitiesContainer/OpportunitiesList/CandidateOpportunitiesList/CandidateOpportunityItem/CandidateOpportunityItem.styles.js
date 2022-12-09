import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

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
  white-space: nowrap;
`;

export const ActionContainer = styled.div`
  color: ${COLORS.gray};
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const Title = styled.p`
  margin: 0;
  font-weight: bold;
  text-overflow: ellipsis;
`;

export const Company = styled.p`
  margin: 6px 0 0;
  color: ${COLORS.darkGray};
  text-overflow: ellipsis;
`;

export const Info = styled.p`
  margin: 6px 0 0;
  display: flex;
  flex-direction: row;
  color: ${COLORS.darkGray};
  text-overflow: ellipsis;
`;

export const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DescriptionTitle = styled.p`
  margin: 0 0 6px;
  font-weight: bold;
`;

export const DescriptionContainer = styled.div`
  max-height: 3.6em;
  overflow: hidden;
  white-space: nowrap;
`;

export const Description = styled.p`
  line-height: 1.2em;
  margin: 0;
  text-overflow: ellipsis;
`;
