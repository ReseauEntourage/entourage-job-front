import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EXTERNAL_LINKS } from '@/src/constants';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { AssociationEntourage } from '../AssociationEntourage/AssociationEntourage';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('AssociationEntourage', () => {
  it('presents the association with a tracked link to its website', () => {
    render(<AssociationEntourage />);
    expect(screen.getByText("A propos d'Entourage")).toBeInTheDocument();
    expect(screen.getByAltText('Association Entourage')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', EXTERNAL_LINKS.ENTOURAGE);
    fireEvent.click(screen.getByRole('button', { name: 'Voir le site' }));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.FOOTER_SITE_ENTOURAGE_CLIC);
  });
});
