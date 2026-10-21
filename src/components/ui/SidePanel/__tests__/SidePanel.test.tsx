import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { SidePanel } from '../SidePanel';

const mockIsDesktop = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => mockIsDesktop(),
}));

describe('SidePanel', () => {
  beforeEach(() => mockIsDesktop.mockReturnValue(true));

  it('renders children without header when there is no title', () => {
    const { container } = render(
      <SidePanel variant="white">Contenu</SidePanel>
    );
    expect(screen.getByText('Contenu')).toBeInTheDocument();
    expect(container.querySelector('hr')).not.toBeInTheDocument();
  });

  it('renders title and subtitle in a header', () => {
    render(
      <SidePanel variant="white" title="Titre" subtitle={<em>Sous</em>}>
        Contenu
      </SidePanel>
    );
    expect(screen.getByText('Titre')).toBeInTheDocument();
    expect(screen.getByText('Sous')).toBeInTheDocument();
  });

  it('renders a background photo only on desktop with the blue gradient', () => {
    const { container, rerender } = render(
      <SidePanel variant="blue-gradient" backgroundPhoto={{ src: '/bg.jpg' }}>
        Contenu
      </SidePanel>
    );
    const withPhoto = container.querySelectorAll('div').length;

    mockIsDesktop.mockReturnValue(false);
    rerender(
      <SidePanel
        variant="blue-gradient"
        backgroundPhoto={{ src: '/bg.jpg', position: 'top' }}
      >
        Contenu
      </SidePanel>
    );
    expect(container.querySelectorAll('div').length).toBeLessThan(withPhoto);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });
});
