import React from 'react';
import styled from 'styled-components';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';

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
        <LucidIcon name="Mail" />
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
        <LucidIcon name="MailCheck" />
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
        <LucidIcon name="Trash" />
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
        <LucidIcon name="Mail" />
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
        <LucidIcon name="Check" />
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
        <LucidIcon name="Trash" />
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
        <LucidIcon name="Calendar" />
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
        <LucidIcon name="Check" />
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
        <LucidIcon name="Trash" />
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
