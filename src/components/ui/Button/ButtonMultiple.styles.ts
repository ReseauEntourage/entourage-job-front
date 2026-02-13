import styled from 'styled-components';

export const StyledButtonMenu = styled.div`
  flex-direction: column;
  position: absolute;
  z-index: 100;
  transition: 0.3s ease-in-out;
  background-color: white;
  box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
  margin-top: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  ${({ align }) => {
    if (align === 'left') {
      return {
        left: 0,
      };
    }

    if (align === 'right') {
      return {
        right: 0,
      };
    }

    return {};
  }}
  display: ${({ isOpen }) => {
    return isOpen ? 'flex' : 'none';
  }};
  opacity: ${({ isOpen }) => {
    return isOpen ? '1' : '0';
  }};
  > * {
    min-width: max-content;
    display: flex;
    text-align: ${({ align }) => {
      return align;
    }};
    justify-content: ${({ align }) => {
      if (align === 'left') {
        return 'flex-start';
      }

      if (align === 'right') {
        return 'flex-end';
      }

      return {};
    }};
  }

)
`;

export const StyledButtonContainer = styled.div`
  position: relative;
`;
