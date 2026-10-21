import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { EntityCard } from '../EntityCard/EntityCard';
import { RoleBadge } from '../ProfileCard/RoleBadge';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('RoleBadge', () => {
  it('labels candidates and coaches', () => {
    const { unmount } = render(<RoleBadge role={UserRoles.CANDIDATE} />);
    expect(screen.getByText('Candidat')).toBeInTheDocument();
    unmount();
    render(<RoleBadge role={UserRoles.COACH} />);
    expect(screen.getByText('Coach')).toBeInTheDocument();
  });

  it('renders nothing for other roles', () => {
    const { container } = render(<RoleBadge role={UserRoles.ADMIN} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('EntityCard', () => {
  it('is a link to its target and notifies clicks', () => {
    const onClick = jest.fn();
    render(
      <EntityCard href="/target" onClick={onClick} borderColor="primaryBlue">
        Carte
      </EntityCard>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/target');
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
