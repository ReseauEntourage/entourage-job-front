import React from 'react';
import CalendarIcon from 'assets/custom/icons/calendar.svg';
import MailIcon from 'assets/custom/icons/mail.svg';
import TrashIcon from 'assets/custom/icons/trash.svg';
import CheckIcon from 'assets/custom/icons/check.svg';

const MailIconProps = { width: 17, height: 15, viewBox: '0 -2 15 17' };
const TrashIconProps = { width: 13, height: 15, viewBox: '0 0 13 15' };
const CalendarIconProps = { width: 15, height: 15, viewBox: '0 0 15 18' };
const CheckIconProps = { width: 22, height: 15, viewBox: '0 0 26 18' };

export const allCTAs = {
  apply: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'contactEmail',
    text: (
      <>
        <MailIcon {...MailIconProps} />
        Je postule
      </>
    ),
  },
  applied: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToApplied',
    text: (
      <>
        <MailIcon {...MailIconProps} />
        J&apos;ai déjà postulé
      </>
    ),
  },
  notInterested: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'archive',
    text: (
      <>
        <TrashIcon {...TrashIconProps} />
        Je ne suis pas intéressé
      </>
    ),
  },
  resend: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'contactRelance',
    text: (
      <>
        <MailIcon {...MailIconProps} />
        Je veux relancer l&apos;entreprise
      </>
    ),
  },
  gotInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToInterview',
    text: (
      <>
        <CheckIcon {...CheckIconProps} />
        J&apos;ai décroché un entretien
      </>
    ),
  },
  abandon: {
    color: 'darkGrayFont',
    className: 'custom-primary-inverted',
    action: 'abandon',
    text: (
      <>
        <TrashIcon {...TrashIconProps} />
        J&apos;abandonne cette offre
      </>
    ),
  },
  dateInterview: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'addDateInterview',
    text: (
      <>
        <CalendarIcon {...CalendarIconProps} />
        Je note une date d&apos;entretien
      </>
    ),
  },
  gotJob: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'updateToHired',
    text: (
      <>
        <CheckIcon {...CheckIconProps} />
        J&apos;ai décroché le job
      </>
    ),
  },
  dateBegin: {
    color: 'primaryOrange',
    className: 'custom-primary-inverted',
    action: 'addDateHired',
    text: (
      <>
        <CalendarIcon {...CalendarIconProps} />
        Je note ma date d&apos;embauche
      </>
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
