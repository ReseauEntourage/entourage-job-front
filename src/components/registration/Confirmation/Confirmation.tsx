import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Typography } from 'src/components/utils';
import {
  registrationActions,
  selectRegistrationConfirmationStepContent,
} from 'src/use-cases/registration';
import {
  StyledRegistrationContainer,
  StyledRegistrationSubtitle,
} from '../Registration.styles';

export function Confirmation() {
  const dispatch = useDispatch();
  const pageContent = useSelector(selectRegistrationConfirmationStepContent);

  return (
    <StyledRegistrationContainer>
      <Card title={pageContent.title}>
        <StyledRegistrationSubtitle>
          <Typography weight="normal">{pageContent.subtitle}</Typography>
        </StyledRegistrationSubtitle>
        {pageContent.bullets.map(({ icon, title, text }) => (
          <div key={title}>
            {icon}
            <Typography weight="normal">{title}</Typography>
            <Typography weight="normal">{text}</Typography>
          </div>
        ))}
        <Button
          onClick={() => {
            dispatch(registrationActions.resetRegistrationData());
          }}
        >
          Accéder à mon profil
        </Button>
      </Card>
    </StyledRegistrationContainer>
  );
}
