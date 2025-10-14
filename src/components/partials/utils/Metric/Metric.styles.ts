import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import { BubblePosition } from './Metric.types';

export const StyledMetricCard = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledCoverContainer = styled.div<{ imageUrl: string }>`
  background: url(${(props) => props.imageUrl});
  background-size: cover;
  position: relative;
  width: 100%;
  height: 300px;
`;

export const StyledBubble = styled.div<{ position: BubblePosition }>`
  background-color: ${COLORS.hoverBlue};
  width: 60%;
  position: absolute;
  top: ${(props) => (props.position.includes('top') ? '12px' : 'unset')};
  bottom: ${(props) => (props.position.includes('bottom') ? '12px' : 'auto')};
  left: ${(props) => (props.position.includes('left') ? '6px' : 'auto')};
  right: ${(props) => (props.position.includes('right') ? '6px' : 'auto')};
  border-radius: 0 12px 12px;
  padding: 20px 16px;
`;

export const StyledTitleAndSourceContainer = styled.div`
  padding: 10px 20px;
  flex: 1;
`;
