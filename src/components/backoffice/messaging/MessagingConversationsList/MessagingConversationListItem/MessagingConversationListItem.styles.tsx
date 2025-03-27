import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const ContainerStyled = styled.div<{ isActive: boolean }>`
  display: flex;
  gap: 10px;
  padding: 20px 15px;
  cursor: pointer;
  background: ${(props) => {
    return props.isActive ? COLORS.hoverBlue : COLORS.white;
  }};

  &:hover {
    background-color: ${COLORS.hoverBlue};
  }

  * {
    margin: 0;
  }
`;

export const ContainerAvatarStyled = styled.div`
  align-items: flex-start;
`;

export const RightColumn = styled.div<{ highlight: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;

  p.preview-last-message {
    color: ${(props) => {
      return props.highlight ? COLORS.black : COLORS.mediumGray;
    }};
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-weight: ${(props) => {
      return props.highlight ? '400' : '700';
    }};
  }
`;

export const MainInfos = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

export const ConversationAddresee = styled.div`
  flex: auto;
  .addresee-name {
    font-weight: 700;
    font-size: 16px;
  }
`;
