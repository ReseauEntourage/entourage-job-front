import React from 'react';
import styled from 'styled-components';
import CalendarIcon from 'assets/icons/calendar.svg';
import CheckIcon from 'assets/icons/check.svg';
import EmailIcon from 'assets/icons/email.svg';
import TrashIcon from 'assets/icons/trash.svg';

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  justify-content: center;

  > svg {
    margin-right: 8px;
  }
`;

export const allCTAs = {
  apply: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'contactEmail',
    text: (
      <StyledButtonContainer>
        <EmailIcon />
        Je postule
      </StyledButtonContainer>
    ),
  },
  applied: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'updateToApplied',
    text: (
      <StyledButtonContainer>
        <EmailIcon />
        J&apos;ai déjà postulé
      </StyledButtonContainer>
    ),
  },
  notInterested: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'archive',
    text: (
      <StyledButtonContainer>
        <TrashIcon />
        Je ne suis pas intéressé
      </StyledButtonContainer>
    ),
  },
  resend: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'contactRelance',
    text: (
      <StyledButtonContainer>
        <EmailIcon />
        Je veux relancer l&apos;entreprise
      </StyledButtonContainer>
    ),
  },
  gotInterview: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'updateToInterview',
    text: (
      <StyledButtonContainer>
        <CheckIcon />
        J&apos;ai décroché un entretien
      </StyledButtonContainer>
    ),
  },
  abandon: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'abandon',
    text: (
      <StyledButtonContainer>
        <TrashIcon />
        J&apos;abandonne cette offre
      </StyledButtonContainer>
    ),
  },
  dateInterview: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'addDateInterview',
    text: (
      <StyledButtonContainer>
        <CalendarIcon />
        Je note une date d&apos;entretien
      </StyledButtonContainer>
    ),
  },
  gotJob: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'updateToHired',
    text: (
      <StyledButtonContainer>
        <CheckIcon />
        J&apos;ai décroché le job
      </StyledButtonContainer>
    ),
  },
  dateBegin: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: 'addDateHired',
    text: (
      <StyledButtonContainer>
        <CalendarIcon />
        Je note ma date d&apos;embauche
      </StyledButtonContainer>
    ),
  },
  trialValidated: {
    color: 'primaryBlue',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "J'ai validé ma période d'essai",
  },
  trialUnvalidated: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: () => {},
    text: "Je n'ai pas validé la période d'essai",
  },
  feedback: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: () => {},
    text: 'Je demande un retour du recruteur',
  },
};

export const CTAsByTab = [
  {
    tab: 0,
    ctas: ['apply', 'applied', 'notInterested'],
  },
  {
    tab: 1,
    ctas: ['resend', 'gotInterview', 'abandon'],
  },
  {
    tab: 2,
    ctas: ['dateInterview', 'gotJob', 'abandon'],
  },
  {
    tab: 3,
    ctas: [
      // 'feedback'
    ],
  },
  {
    tab: 4,
    ctas: [
      'dateBegin',
      // 'trialValidated',
      // 'trialUnvalidated'
    ],
  },
];
