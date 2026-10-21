import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { PublicCV } from '@/src/api/types';
import { FB_TAGS, GA_TAGS } from '@/src/constants/tags';
import { openModal } from '@/src/features/modals/Modal';
import { fbEvent } from '@/src/lib/fb';
import { gaEvent } from '@/src/lib/gtag';
import { CVShareButtons } from '../CVShareButtons';

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/cv/marie?utm=1' }),
}));
jest.mock('@/src/lib/fb', () => ({ fbEvent: jest.fn() }));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/features/modals/Modal', () => ({ openModal: jest.fn() }));
jest.mock(
  '@/src/features/modals/Modal/ModalGeneric/StepperModal/ModalShareCV',
  () => ({ ModalShareCV: () => null })
);

type ShareProps = {
  children: React.ReactNode;
  disabled?: boolean;
  url: string;
  title?: string;
  summary?: string;
  hashtag?: string;
  hashtags?: string[];
  onClick?: () => void;
  onShareWindowClose?: () => void;
};
// react-share opens a popup window that cannot exist in jsdom: replace each
// network button by a stub exposing its props and callbacks.
jest.mock('react-share', () => {
  const makeButton = (name: string) => {
    const Button = (props: ShareProps) => (
      <button
        data-testid={name}
        disabled={props.disabled}
        data-url={props.url}
        data-title={props.title}
        data-summary={props.summary}
        data-hashtag={props.hashtag}
        data-hashtags={props.hashtags?.join(',')}
        onClick={props.onClick}
        onBlur={props.onShareWindowClose}
      >
        {props.children}
      </button>
    );
    return Button;
  };
  return {
    LinkedinShareButton: makeButton('linkedin'),
    FacebookShareButton: makeButton('facebook'),
    XShareButton: makeButton('x'),
    WhatsappShareButton: makeButton('whatsapp'),
  };
});

const publicCV = { firstName: 'Marie' } as PublicCV;

describe('CVShareButtons', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders one button per network sharing the page url without its query string', () => {
    render(<CVShareButtons publicCV={publicCV} />);
    ['linkedin', 'facebook', 'x', 'whatsapp'].forEach((network) => {
      const url = screen.getByTestId(network).getAttribute('data-url');
      expect(url).toMatch(/\/cv\/marie$/);
    });
  });

  it('describes the candidate in the shared texts', () => {
    render(<CVShareButtons publicCV={publicCV} />);
    expect(screen.getByTestId('linkedin').getAttribute('data-title')).toContain(
      'Aidez Marie'
    );
    expect(screen.getByTestId('whatsapp').getAttribute('data-title')).toContain(
      'aidons Marie'
    );
    expect(screen.getByTestId('facebook')).toHaveAttribute(
      'data-hashtag',
      '#EntouragePro'
    );
    expect(screen.getByTestId('x')).toHaveAttribute(
      'data-hashtags',
      'EntouragePro'
    );
  });

  it('disables every button when the action is disabled', () => {
    render(<CVShareButtons publicCV={publicCV} actionDisabled />);
    ['linkedin', 'facebook', 'x', 'whatsapp'].forEach((network) => {
      expect(screen.getByTestId(network)).toBeDisabled();
    });
  });

  it('tracks the opening of a share window', () => {
    render(<CVShareButtons publicCV={publicCV} />);
    fireEvent.click(screen.getByTestId('facebook'));
    expect(fbEvent).toHaveBeenCalledWith(FB_TAGS.SHARE_CV_OPEN);
  });

  [
    ['linkedin', GA_TAGS.PAGE_CV_PARTAGE_CV_LINKEDIN_CLIC],
    ['facebook', GA_TAGS.PAGE_CV_PARTAGE_CV_FACEBOOK_CLIC],
    ['x', GA_TAGS.PAGE_CV_PARTAGE_CV_TWITTER_CLIC],
    ['whatsapp', GA_TAGS.PAGE_CV_PARTAGE_CV_WHATSAPP_CLIC],
  ].forEach(([network, tag]) => {
    it(`tracks the ${network} share and opens the newsletter modal when its window closes`, () => {
      render(<CVShareButtons publicCV={publicCV} />);
      fireEvent.blur(screen.getByTestId(network as string));
      expect(gaEvent).toHaveBeenCalledWith(tag);
      expect(fbEvent).toHaveBeenCalledWith(FB_TAGS.SHARE_CV_SEND);
      expect(openModal).toHaveBeenCalledTimes(1);
    });
  });
});
