import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useIsDesktop } from '@/src/hooks/utils';
import { platform } from './Device';

jest.mock('@/src/hooks/utils', () => ({ useIsDesktop: jest.fn() }));

const mockUseIsDesktop = useIsDesktop as jest.Mock;

const Desktop = ({ label }: { label: string }) => <div>desktop {label}</div>;
const Mobile = ({ label }: { label: string }) => <div>mobile {label}</div>;

describe('platform', () => {
  it('renders the Desktop component with its props on desktop', () => {
    mockUseIsDesktop.mockReturnValue(true);
    const Component = platform({ Desktop, Mobile });
    render(<Component label="x" />);
    expect(screen.getByText('desktop x')).toBeTruthy();
    expect(screen.queryByText('mobile x')).toBeNull();
  });

  it('renders the Mobile component on mobile', () => {
    mockUseIsDesktop.mockReturnValue(false);
    const Component = platform({ Desktop, Mobile });
    render(<Component label="y" />);
    expect(screen.getByText('mobile y')).toBeTruthy();
  });

  it('renders nothing when the matching variant is missing', () => {
    mockUseIsDesktop.mockReturnValue(false);
    const Component = platform({ Desktop });
    const { container } = render(<Component label="z" />);
    expect(container.innerHTML).toBe('');

    mockUseIsDesktop.mockReturnValue(true);
    const MobileOnly = platform({ Mobile });
    const { container: c2 } = render(<MobileOnly label="z" />);
    expect(c2.innerHTML).toBe('');
  });
});
