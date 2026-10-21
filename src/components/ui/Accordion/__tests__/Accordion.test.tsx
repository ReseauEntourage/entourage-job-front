import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Accordion } from '../Accordion';

describe('Accordion', () => {
  it('is closed by default and hides its content', () => {
    render(<Accordion headerContent="Titre">Corps</Accordion>);
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.queryByText('Corps')).not.toBeInTheDocument();
  });

  it('opens by default when defaultOpen is set', () => {
    render(
      <Accordion headerContent="Titre" defaultOpen>
        Corps
      </Accordion>
    );
    expect(screen.getByText('Corps')).toBeVisible();
  });

  it('toggles on header click (uncontrolled) and notifies onOpenChange', () => {
    const onOpenChange = jest.fn();
    render(
      <Accordion headerContent="Titre" onOpenChange={onOpenChange}>
        Corps
      </Accordion>
    );
    fireEvent.click(screen.getByTestId('accordion-header'));
    expect(screen.getByText('Corps')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(screen.getByTestId('accordion-header'));
    expect(screen.queryByText('Corps')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('does not change by itself when controlled', () => {
    const onOpenChange = jest.fn();
    render(
      <Accordion
        headerContent="Titre"
        isOpen={false}
        onOpenChange={onOpenChange}
      >
        Corps
      </Accordion>
    );
    fireEvent.click(screen.getByTestId('accordion-header'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Corps')).not.toBeInTheDocument();
  });

  it('keeps the content mounted but hidden when keepContentMounted', () => {
    render(
      <Accordion headerContent="Titre" keepContentMounted id="acc">
        Corps
      </Accordion>
    );
    const content = screen.getByTestId('acc-content');
    expect(content).toHaveAttribute('aria-hidden', 'true');
    expect(content).not.toBeVisible();
  });
});
