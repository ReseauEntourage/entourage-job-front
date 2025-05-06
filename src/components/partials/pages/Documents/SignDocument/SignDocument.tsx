import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/utils';
import { CheckBox } from 'src/components/utils/Inputs';
import { WarningStrip } from 'src/components/utils/WarningStrip';
import { DocumentNameType, ReduxRequestEvents } from 'src/constants';
import {
  currentUserActions,
  readDocumentSelectors,
} from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';
import {
  StyledSignDocument,
  StyledSignDocumentButtonContainer,
} from './SignDocument.styles';

interface SignDocumentProps {
  documentName: DocumentNameType;
  label: string;
}

export const SignDocument = ({ documentName, label }: SignDocumentProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const readDocumentStatus = useSelector(
    readDocumentSelectors.selectReadDocumentStatus
  );

  useEffect(() => {
    if (readDocumentStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `Validation confirmée`,
        })
      );
    } else if (readDocumentStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
    }
  }, [readDocumentStatus, dispatch]);

  const handleSignDocument = useCallback(async () => {
    if (isChecked) {
      dispatch(currentUserActions.readDocumentRequested({ documentName }));
    } else {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Veuillez accepter le document avant de valider`,
        })
      );
    }
  }, [isChecked, dispatch, documentName]);

  return (
    <StyledSignDocument>
      <WarningStrip>
        <CheckBox
          title={label}
          value={isChecked}
          useOutsideOfForm
          onChange={() => setIsChecked((v) => !v)}
          name="accept-ethic-charter"
          id="charte-ethique-checkbox"
        />
      </WarningStrip>
      <StyledSignDocumentButtonContainer>
        <Button variant="primary" rounded onClick={handleSignDocument}>
          Valider
        </Button>
      </StyledSignDocumentButtonContainer>
    </StyledSignDocument>
  );
};
