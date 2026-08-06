import { styled } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

export const StyledCollaboratorSmallCardContainer = styled.div<{
  $pointer?: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;

  cursor: ${(props) => (props.$pointer ? 'pointer' : 'default')};
  * {
    cursor: ${(props) => (props.$pointer ? 'pointer' : 'default')};
  }
`;

export const StyledCollaboratorSmallCardPictureContainerStyled = styled.div`
  min-width: 80px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-width: 50px;
    width: 50px;
    height: 50px;
  }
`;

export const StyledCollaboratorSmallCardInfosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: auto;
  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; // Limit to 2 lines
    -webkit-box-orient: vertical;
    margin: 0;
  }
`;
