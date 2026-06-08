import styled from 'styled-components';

export const StyledEventCardPictureContainer = styled.div`
  position: relative;
`;

export const StyledEventCardPicture = styled.div`
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  position: relative;
  height: 175px;
`;

export const StyledEventCardOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
`;

export const StyledEventCardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 20px;
  gap: 10px;
  flex: 1;
`;
