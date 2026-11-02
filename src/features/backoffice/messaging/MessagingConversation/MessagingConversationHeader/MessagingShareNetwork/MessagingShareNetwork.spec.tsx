jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/useProfileShare', () => ({
  useProfileShare: jest.fn(),
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { useProfileShare } from '@/src/hooks/useProfileShare';
import { MessagingShareNetwork } from './MessagingShareNetwork';

const mockUseProfileShare = useProfileShare as jest.Mock;

describe('MessagingShareNetwork', () => {
  const handleWhatsappShare = jest.fn();
  const handleLinkedinShare = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProfileShare.mockReturnValue({
      handleWhatsappShare,
      handleLinkedinShare,
      isWhatsappLoading: false,
    });
  });

  afterEach(() => cleanup());

  it('shares the profile of the given user', () => {
    render(<MessagingShareNetwork profileId="p1" firstName="Awa" />);
    expect(mockUseProfileShare).toHaveBeenCalledWith({
      profileId: 'p1',
      firstName: 'Awa',
    });
  });

  it('keeps the sharing options hidden until the toggle is clicked', () => {
    render(<MessagingShareNetwork profileId="p1" firstName="Awa" />);
    expect(screen.queryByText(/Partager sur LinkedIn/)).toBeNull();
    fireEvent.click(screen.getByTestId('messaging-share-network-toggle'));
    expect(screen.getByText(/Partager sur LinkedIn/)).toBeInTheDocument();
    expect(screen.getByText(/Partager sur WhatsApp/)).toBeInTheDocument();
  });

  it('triggers the LinkedIn share', () => {
    render(<MessagingShareNetwork profileId="p1" firstName="Awa" />);
    fireEvent.click(screen.getByTestId('messaging-share-network-toggle'));
    fireEvent.click(screen.getByText(/Partager sur LinkedIn/));
    expect(handleLinkedinShare).toHaveBeenCalledTimes(1);
    expect(handleWhatsappShare).not.toHaveBeenCalled();
  });

  it('triggers the WhatsApp share', () => {
    render(<MessagingShareNetwork profileId="p1" firstName="Awa" />);
    fireEvent.click(screen.getByTestId('messaging-share-network-toggle'));
    fireEvent.click(screen.getByText(/Partager sur WhatsApp/));
    expect(handleWhatsappShare).toHaveBeenCalledTimes(1);
    expect(handleLinkedinShare).not.toHaveBeenCalled();
  });

  it('shows the text button by default', () => {
    render(<MessagingShareNetwork profileId="p1" firstName="Awa" />);
    expect(screen.getByText('Partager le profil')).toBeInTheDocument();
    expect(
      screen.getByTestId('messaging-share-network-toggle')
    ).not.toHaveAttribute('aria-haspopup');
  });

  describe('icon only', () => {
    it('is named by its accessible label and shows no text', () => {
      render(<MessagingShareNetwork profileId="p1" firstName="Awa" iconOnly />);
      expect(screen.getByRole('button', { name: 'Partager le profil' })).toBe(
        screen.getByTestId('messaging-share-network-toggle')
      );
      expect(screen.queryByText('Partager le profil')).toBeNull();
    });

    it('opens the same sharing options as the text button', () => {
      render(<MessagingShareNetwork profileId="p1" firstName="Awa" iconOnly />);
      expect(screen.queryByText(/Partager sur LinkedIn/)).toBeNull();
      fireEvent.click(screen.getByTestId('messaging-share-network-toggle'));
      fireEvent.click(screen.getByText(/Partager sur LinkedIn/));
      expect(handleLinkedinShare).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByTestId('messaging-share-network-toggle'));
      fireEvent.click(screen.getByText(/Partager sur WhatsApp/));
      expect(handleWhatsappShare).toHaveBeenCalledTimes(1);
    });

    it('tells assistive technologies when the menu is open', () => {
      render(<MessagingShareNetwork profileId="p1" firstName="Awa" iconOnly />);
      const toggle = screen.getByTestId('messaging-share-network-toggle');
      expect(toggle).toHaveAttribute('aria-haspopup', 'menu');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('shows a tooltip on hover', () => {
      render(<MessagingShareNetwork profileId="p1" firstName="Awa" iconOnly />);
      fireEvent.mouseEnter(
        screen.getByTestId('messaging-share-network-toggle')
      );
      expect(screen.getByText('Partager le profil')).toBeInTheDocument();
    });

    it('is disabled while the WhatsApp text is loading', () => {
      mockUseProfileShare.mockReturnValue({
        handleWhatsappShare,
        handleLinkedinShare,
        isWhatsappLoading: true,
      });
      render(<MessagingShareNetwork profileId="p1" firstName="Awa" iconOnly />);
      expect(
        screen.getByTestId('messaging-share-network-toggle')
      ).toBeDisabled();
    });
  });

  it('disables the toggle while the WhatsApp text is loading', () => {
    mockUseProfileShare.mockReturnValue({
      handleWhatsappShare,
      handleLinkedinShare,
      isWhatsappLoading: true,
    });
    render(<MessagingShareNetwork profileId="p1" firstName="Awa" />);
    expect(screen.getByTestId('messaging-share-network-toggle')).toBeDisabled();
  });
});
