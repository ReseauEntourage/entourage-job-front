import React, { useCallback, useState } from 'react';
import { DocumentNamesTypes } from 'src/api/types';
import { Button } from 'src/components/utils';
import { CheckBox } from 'src/components/utils/Inputs';
import { WarningStrip } from 'src/components/utils/WarningStrip';
import { StyledSignDocument, StyledSignDocumentButtonContainer } from './SignDocument.styles';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'src/use-cases/authentication';

interface SignDocumentProps {
  documentName: DocumentNamesTypes;
}

export const SignDocument = ({documentName}: SignDocumentProps) => {
  
    const [ isChecked, setIsChecked ] = useState(false);
    const user  = useSelector(selectCurrentUser);

    const handleSignDocument = useCallback(() => {
        if (isChecked) {
            
        }
    }, [isChecked]);


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
                    onClick={() => {
                        handleSignDocument()
                    }}
                >
                    Valider
                </Button>
            </StyledSignDocumentButtonContainer>
        </StyledSignDocument>
    )
}
