import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Card } from '../Card';

const mockIsDesktop = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => mockIsDesktop(),
  useIsMobile: () => !mockIsDesktop(),
}));

describe('Card', () => {
  beforeEach(() => {
    mockIsDesktop.mockReturnValue(true);
  });

  it('renders the content without title', () => {
    render(<Card>Contenu</Card>);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('renders title, subtitle and content', () => {
    render(
      <Card title="Titre" subtitle="Sous-titre">
        Contenu
      </Card>
    );
    expect(screen.getByRole('heading', { name: 'Titre' })).toBeInTheDocument();
    expect(screen.getByText('Sous-titre')).toBeInTheDocument();
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('calls onClick and exposes the test id', () => {
    const onClick = jest.fn();
    render(
      <Card onClick={onClick} dataTestId="card">
        Contenu
      </Card>
    );
    fireEvent.click(screen.getByTestId('card'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner next to the title while loading', () => {
    const { container } = render(
      <Card title="Titre" isLoading>
        Contenu
      </Card>
    );
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('collapses on desktop when closable via the chevron button', () => {
    render(
      <Card title="Titre" isDesktopClosable>
        Contenu
      </Card>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('collapses when the title is clicked on a closable card', () => {
    render(
      <Card title="Titre" isDesktopClosable>
        Contenu
      </Card>
    );
    fireEvent.click(screen.getByText('Titre'));
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument();
  });

  it('starts closed with isDefaultOpen false', () => {
    render(
      <Card title="Titre" isDefaultOpen={false} isDesktopClosable>
        Contenu
      </Card>
    );
    expect(screen.queryByText('Contenu')).not.toBeInTheDocument();
  });

  it('is not closable on desktop when only mobile closable', () => {
    render(
      <Card title="Titre" isMobileClosable>
        Contenu
      </Card>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Titre'));
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });

  it('is closable on mobile when mobile closable', () => {
    mockIsDesktop.mockReturnValue(false);
    render(
      <Card title="Titre" isMobileClosable>
        Contenu
      </Card>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
