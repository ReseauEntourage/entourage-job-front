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
`;

export const allCTAs = {
  apply: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'contactEmail',
    text: (
      <StyledButtonContainer>
        <EmailIcon />
        &nbsp;Je postule
      </StyledButtonContainer>
    ),
  },
  applied: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToApplied',
    text: (
      <StyledButtonContainer>
        <EmailIcon />
        &nbsp;J&apos;ai déjà postulé
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
        &nbsp;Je ne suis pas intéressé
      </StyledButtonContainer>
    ),
  },
  resend: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'contactRelance',
    text: (
      <StyledButtonContainer>
        <EmailIcon />
        &nbsp;Je veux relancer l&apos;entreprise
      </StyledButtonContainer>
    ),
  },
  gotInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToInterview',
    text: (
      <StyledButtonContainer>
        <CheckIcon />
        &nbsp;J&apos;ai décroché un entretien
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
        &nbsp;J&apos;abandonne cette offre
      </StyledButtonContainer>
    ),
  },
  dateInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'addDateInterview',
    text: (
      <StyledButtonContainer>
        <CalendarIcon />
        &nbsp;Je note une date d&apos;entretien
      </StyledButtonContainer>
    ),
  },
  gotJob: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToHired',
    text: (
      <StyledButtonContainer>
        <CheckIcon />
        &nbsp;J&apos;ai décroché le job
      </StyledButtonContainer>
    ),
  },
  dateBegin: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'addDateHired',
    text: (
      <StyledButtonContainer>
        <CalendarIcon />
        &nbsp;Je note ma date d&apos;embauche
      </StyledButtonContainer>
    ),
  },
  trialValidated: {
    color: 'primaryOrange',
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
