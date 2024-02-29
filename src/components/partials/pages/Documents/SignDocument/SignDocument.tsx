import React, { useCallback, useState } from 'react';
import { DocumentNamesTypes } from 'src/api/types';
import { Button } from 'src/components/utils';
import { CheckBox } from 'src/components/utils/Inputs';
import { WarningStrip } from 'src/components/utils/WarningStrip';
import { StyledSignDocument, StyledSignDocumentButtonContainer } from './SignDocument.styles';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'src/use-cases/authentication';
import { Api } from 'src/api';

interface SignDocumentProps {
  documentName: DocumentNamesTypes;
}

export const SignDocument = ({documentName}: SignDocumentProps) => {
  
    const [ isChecked, setIsChecked ] = useState(false);
    const user  = useSelector(selectCurrentUser);

    const handleSignDocument = useCallback(async () => {
        if (isChecked && user) {
            try {
                Api.postReadDocument({documentName}, user.id);
                console.log("done")
            } catch {
                console.log("error")
            }
        } else {
            console.log("error")
        }
    }, [isChecked, user]);


    return (
        <StyledSignDocument>
            <WarningStrip>
                    <CheckBox
                        title="J'accepte la charte éthique Entourage pro"
                        value={isChecked}
                        useOutsideOfForm
                        onChange={() => setIsChecked(isChecked => !isChecked)}
                        name="accept-ethic-charter"
                        id="charte-ethique-checkbox"
                    />
            </WarningStrip>
            <StyledSignDocumentButtonContainer>
                <Button
                    style="custom-secondary-inverted"
                    onClick={handleSignDocument}
                >
                    Valider
                </Button>
            </StyledSignDocumentButtonContainer>
        </StyledSignDocument>
    )
}
