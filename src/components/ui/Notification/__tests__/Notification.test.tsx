import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Notification } from '../Notification';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('Notification', () => {
  (['success', 'danger'] as const).forEach((type) => {
    it(`renders the ${type} message`, () => {
      const { container } = render(<Notification type={type} message="Fait" />);
      expect(screen.getByText('Fait')).toBeInTheDocument();
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
