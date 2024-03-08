import styled from 'styled-components';

export const StyledRegistrationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    max-width: 700px;
  }
`;

export const StyledRegistrationFooter = styled.div`
  margin-top: 32px;
`;

export const StyledRegistrationSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledRegistrationSubtitle = styled.div`
  margin-bottom: 32px;
`;

export const StyledRegistrationListItem = styled.div`
  display: flex;
  align-items: center;

  :not(:last-child) {
    margin-bottom: 32px;
  }
`;

export const StyledRegistrationListItemLabels = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledRegistrationListItemIcon = styled.div`
  min-width: 80px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledRegistrationButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-top: 32px;
`;
