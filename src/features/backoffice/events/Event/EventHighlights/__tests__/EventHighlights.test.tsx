import { render, screen } from '@testing-library/react';

import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';

import { EventHighlights } from '../EventHighlights';

describe('EventHighlights', () => {
  it('renders nothing when goal, audience, and format are all absent', () => {
    const { container } = render(
      <EventHighlights
        duration={60}
        format={undefined}
        goal={undefined}
        audience={undefined}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the section when at least one of goal, audience, or format is present', () => {
    render(
      <EventHighlights
        duration={60}
        format={undefined}
        goal="Comprendre le fonctionnement"
        audience={undefined}
      />
    );
    expect(screen.getByText("Points clefs de l'événement")).toBeInTheDocument();
  });
});
