import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledParametresPlaceholder = styled.a`
  color: ${COLORS.primaryOrange};
  text-decoration: underline;
  font-style: italic;

  &:hover {
    text-decoration: underline;
  }
`;

export const StyledEditPictureIconContainer = styled.div`
  position: absolute;
  ${({ isMobile }) => {
    return css`
      bottom: ${isMobile ? 0 : '5%'};
      right: ${isMobile ? 0 : '5%'};
    `;
  }}
  border-radius: 50%;
  background-color: white;
  border: 1px solid ${COLORS.primaryOrange};
  padding: 5px;
`;
