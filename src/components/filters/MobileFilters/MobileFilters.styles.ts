import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

interface StyledMobileFilterDrawerProps {
  isOpen: boolean;
}

export const StyledMobileFilterDrawer = styled.div<StyledMobileFilterDrawerProps>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  background-color: ${COLORS.white};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '-100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledMobileFilterOverlay = styled.div<StyledMobileFilterDrawerProps>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

export const StyledMobileFilterHeader = styled.div`
  display: flex;
  flex-direction: row;
  padding: 16px;
  min-height: 40px;
`;

export const StyledMobileFilterTitle = styled.h3`
  margin: 0;
  margin-left: 16px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 16px;
  font-weight: 700;
`;

export const StyledMobileFilterContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

export const StyledMobileFilterFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: center;
`;

export const StyledMobileFilterList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledMobileFilterItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
`;

export const StyledMobileFilterItemTitle = styled.span`
  font-size: 16px;
`;

export const StyledMobileFilterItemCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  border-radius: 100px;
  min-width: 24px;
  font-size: 12px;
  margin-left: 8px;
  margin-right: 8px;
`;

export const StyledMobileFilterOptions = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledMobileFilterOption = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;

  /* Ajustements pour l'espacement du texte */
  > span {
    flex: 1;
    margin-right: 12px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const StyledMobileFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid ${COLORS.gray['200']};
  border-radius: 100px;
  background-color: ${COLORS.white};
  color: ${COLORS.black};
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;

  &:focus {
    outline: none;
  }
`;

export const StyledMobileFilterItemActions = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;

  /* Ajustements pour aligner la checkbox correctement */
  .checkbox-label {
    padding-left: 24px; /* Augmenter l'espace pour la checkmark */
    min-height: 24px; /* Garantir une hauteur minimale */
    display: flex;
    align-items: center;
  }

  /* Réduire la marge en bas pour éviter l'espace supplémentaire */
  > div {
    margin-bottom: 0;
  }
`;

export const StyledMobileFilterFullWidth = styled.div`
  width: 100%;
`;

export const StyledMobileFilterButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
