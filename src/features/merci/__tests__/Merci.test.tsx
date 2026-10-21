import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { Merci, ThankYouMessagesType } from '../Merci/Merci';

describe('Merci', () => {
  const cases: [ThankYouMessagesType, RegExp][] = [
    ['coach', /Webinaire/],
    ['candidate', /Nous vous donnerons des nouvelles rapidement/],
    ['connector', /finaliser votre engagement/],
  ];

  cases.forEach(([type, message]) => {
    it(`thanks a ${type} for their registration with a dedicated message`, () => {
      render(<Merci currentType={type} />);
      expect(
        screen.getByText('Merci beaucoup pour votre inscription !')
      ).toBeInTheDocument();
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  it('thanks for the form when there is no type', () => {
    render(<Merci currentType={undefined as never} />);
    expect(
      screen.getByText("Merci beaucoup d'avoir répondu au formulaire !")
    ).toBeInTheDocument();
    expect(screen.queryByText(/inscription/)).toBeNull();
  });

  it('always signs and links back to the home page', () => {
    render(<Merci currentType="coach" />);
    expect(screen.getByText("L'équipe Entourage Pro")).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: "Revenir à la page d'accueil" })
    ).toHaveAttribute('href', '/');
  });
});
