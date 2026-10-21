jest.mock('next/router', () => ({ useRouter: jest.fn() }));

jest.mock('@/src/features/backoffice/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="LoadingScreen" />,
}));

import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import AdminRedirection from '@/src/pages/backoffice/admin';
import CandidateRedirection from '@/src/pages/backoffice/candidat/[candidateId]';
import RefererRedirection from '@/src/pages/backoffice/referer';

const mockUseRouter = useRouter as jest.Mock;

describe('backoffice redirection pages', () => {
  beforeEach(() => jest.clearAllMocks());

  it('admin index redirects to the members list and keeps the query', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      replace,
      pathname: '/backoffice/admin',
      query: { a: '1' },
    });
    render(<AdminRedirection />);

    expect(screen.getByTestId('LoadingScreen')).toBeTruthy();
    expect(replace).toHaveBeenCalledWith(
      { pathname: '/backoffice/admin/membres', query: { a: '1' } },
      undefined,
      { shallow: true }
    );
  });

  it('referer index redirects to the referer dashboard', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      replace,
      pathname: '/backoffice/referer',
      query: {},
    });
    render(<RefererRedirection />);

    expect(replace).toHaveBeenCalledWith(
      { pathname: '/backoffice/referer/dashboard', query: {} },
      undefined,
      { shallow: true }
    );
  });

  it('candidate page redirects to the candidate CV tab', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      replace,
      pathname: '/backoffice/candidat/[candidateId]',
      query: { candidateId: 'c1' },
    });
    render(<CandidateRedirection />);

    expect(replace).toHaveBeenCalledWith(
      {
        pathname: '/backoffice/candidat/[candidateId]/cv',
        query: { candidateId: 'c1' },
      },
      undefined,
      { shallow: true }
    );
  });

  it('candidate page does not redirect again once on the CV tab', () => {
    const replace = jest.fn();
    mockUseRouter.mockReturnValue({
      replace,
      pathname: '/backoffice/candidat/[candidateId]/cv',
      query: {},
    });
    render(<CandidateRedirection />);

    expect(replace).not.toHaveBeenCalled();
  });
});
