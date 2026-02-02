import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledRadioGroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledInput = styled.input<{ radioSize?: 'small' | 'large' }>`
  width: ${(props) => (props.radioSize === 'small' ? '16px' : '20px')};
  height: ${(props) => (props.radioSize === 'small' ? '16px' : '20px')};
`;

export const StyledRadioGroupItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  cursor: pointer;
  background-color: ${COLORS.white};

  &:hover {
    background-color: ${COLORS.hoverBlue};
  }
`;
