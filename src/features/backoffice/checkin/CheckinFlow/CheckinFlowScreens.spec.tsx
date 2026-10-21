import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { Api } from '@/src/api';
import { UserRoles } from '@/src/constants/users';
import {
  createTestStore,
  TestStore,
} from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { CheckinFlow } from './CheckinFlow';

jest.mock('@/src/api');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => ({ hasPicture: false }),
}));
jest.mock('@/src/hooks/useCurrentUserStaffContact', () => ({
  useCurrentUserStaffContact: () => null,
}));
// The final screens have their own specs: stubbed to observe which one is shown.
jest.mock('../CheckinFinalScreenHigh/CheckinFinalScreenHigh', () => ({
  CheckinFinalScreenHigh: () => <div data-testid="final">high</div>,
}));
jest.mock('../CheckinFinalScreenMedium/CheckinFinalScreenMedium', () => ({
  CheckinFinalScreenMedium: () => <div data-testid="final">medium</div>,
}));
jest.mock('../CheckinFinalScreenLow/CheckinFinalScreenLow', () => ({
  CheckinFinalScreenLow: () => <div data-testid="final">low</div>,
}));

const mockGetCheckin = Api.getCheckin as jest.Mock;
const mockSubmit = Api.submitCheckinAnswer as jest.Mock;

const otherParticipant = {
  id: 'o1',
  firstName: 'Marie',
  role: UserRoles.COACH,
  userProfile: { hasPicture: false },
};

const state = (overrides: Record<string, unknown> = {}) => ({
  data: { eligible: true, otherParticipant, checkin: null, ...overrides },
});

const setup = (role = UserRoles.CANDIDATE, conversationId = 'c1') => {
  const store: TestStore = createTestStore();
  store.dispatch(
    currentUserActions.fetchUserSucceeded({
      id: 'u1',
      firstName: 'Jean',
      role,
      gender: 0,
    } as any)
  );
  return renderWithProviders(<CheckinFlow conversationId={conversationId} />, {
    store,
  });
};

const clickContinue = () => fireEvent.click(screen.getByText('Continuer'));

describe('CheckinFlow', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    mockSubmit.mockResolvedValue({ data: {} });
  });

  describe('guards', () => {
    it('shows an error when the checkin cannot be loaded', async () => {
      mockGetCheckin.mockRejectedValue(new Error('boom'));
      setup();

      expect(
        await screen.findByText(
          'Une erreur est survenue, veuillez réessayer plus tard.'
        )
      ).toBeInTheDocument();
    });

    it('says the checkin is unavailable when the user is not eligible', async () => {
      mockGetCheckin.mockResolvedValue(state({ eligible: false }));
      setup();

      expect(
        await screen.findByText("Ce bilan n'est pas (ou plus) disponible.")
      ).toBeInTheDocument();
    });

    it('says the checkin is unavailable when there is no other participant', async () => {
      mockGetCheckin.mockResolvedValue(state({ otherParticipant: null }));
      setup();

      expect(
        await screen.findByText("Ce bilan n'est pas (ou plus) disponible.")
      ).toBeInTheDocument();
    });

    it('thanks the user and links back to the conversation when already completed', async () => {
      mockGetCheckin.mockResolvedValue(
        state({ checkin: { completedAt: '2026-01-01' } })
      );
      setup();

      expect(
        await screen.findByText('Vous avez déjà répondu à ce bilan. Merci !')
      ).toBeInTheDocument();
      fireEvent.click(screen.getByText('Retourner à la conversation'));
      expect(push).toHaveBeenCalledWith(
        '/backoffice/messaging?conversationId=c1'
      );
    });
  });

  describe('intro', () => {
    it('starts with the intro screen, which can be postponed', async () => {
      mockGetCheckin.mockResolvedValue(state());
      setup();

      fireEvent.click(await screen.findByText('Plus tard'));
      expect(push).toHaveBeenCalledWith(
        '/backoffice/messaging?conversationId=c1'
      );
    });

    it('resumes at the first unanswered question for a started checkin, skipping the intro', async () => {
      mockGetCheckin.mockResolvedValue(
        state({
          checkin: {
            completedAt: null,
            stillInTouch: 'YES',
            exchangeModes: ['PHONE'],
          },
        })
      );
      setup();

      expect(
        await screen.findByText('À quelle fréquence échangez-vous avec Marie ?')
      ).toBeInTheDocument();
      expect(screen.queryByText('Faire le bilan')).not.toBeInTheDocument();
    });
  });

  describe('question steps', () => {
    const toFirstQuestion = async (role = UserRoles.CANDIDATE) => {
      mockGetCheckin.mockResolvedValue(state());
      setup(role);
      fireEvent.click(await screen.findByText('Faire le bilan'));
    };

    it('only enables Continue once an answer is selected, and submits it', async () => {
      await toFirstQuestion();

      expect(
        screen.getByText('Êtes-vous encore en lien avec Marie ?')
      ).toBeInTheDocument();
      expect(screen.getByText('Continuer').closest('button')).toBeDisabled();

      fireEvent.click(screen.getByLabelText('Oui'));
      clickContinue();

      await waitFor(() =>
        expect(mockSubmit).toHaveBeenCalledWith('c1', { stillInTouch: 'YES' })
      );
      expect(
        await screen.findByText('Par quels moyens échangez-vous avec Marie ?')
      ).toBeInTheDocument();
    });

    it('uses the past tense in later questions when the exchange is over', async () => {
      await toFirstQuestion();
      fireEvent.click(screen.getByLabelText('Non, nous avons fait le tour'));
      clickContinue();

      expect(
        await screen.findByText('Par quels moyens échangiez-vous avec Marie ?')
      ).toBeInTheDocument();
    });

    it('lets the user pick several exchange modes then a frequency, support and rating', async () => {
      await toFirstQuestion();
      fireEvent.click(screen.getByLabelText('Oui'));
      clickContinue();

      await screen.findByText('Par quels moyens échangez-vous avec Marie ?');
      fireEvent.click(screen.getByLabelText('Par téléphone'));
      fireEvent.click(screen.getByLabelText('En visio'));
      fireEvent.click(screen.getByLabelText('En visio'));
      clickContinue();
      await waitFor(() =>
        expect(mockSubmit).toHaveBeenLastCalledWith('c1', {
          exchangeModes: ['PHONE'],
        })
      );

      await screen.findByText('À quelle fréquence échangez-vous avec Marie ?');
      fireEvent.click(screen.getByLabelText('Deux fois par mois'));
      clickContinue();
      await waitFor(() =>
        expect(mockSubmit).toHaveBeenLastCalledWith('c1', {
          exchangeFrequency: 'TWICE_A_MONTH',
        })
      );
    });

    it('shows an error and stays on the step when the answer cannot be saved', async () => {
      await toFirstQuestion();
      mockSubmit.mockRejectedValue(new Error('500'));
      fireEvent.click(screen.getByLabelText('Oui'));
      clickContinue();

      expect(
        await screen.findByText('Une erreur est survenue, veuillez réessayer.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Êtes-vous encore en lien avec Marie ?')
      ).toBeInTheDocument();
    });
  });

  describe('perceived benefits step', () => {
    const toBenefits = async (role = UserRoles.CANDIDATE) => {
      mockGetCheckin.mockResolvedValue(
        state({
          checkin: {
            completedAt: null,
            stillInTouch: 'YES',
            exchangeModes: ['PHONE'],
            exchangeFrequency: 'WEEKLY',
          },
        })
      );
      setup(role);
      await screen.findByText('Ce que ces échanges vous ont permis de...');
    };

    it('requires an employment type when "find a job" is selected, and sends it', async () => {
      await toBenefits();
      fireEvent.click(
        screen.getByText('Trouver un emploi, un stage ou une alternance')
      );

      expect(screen.getByText("De quoi s'agit-il ?")).toBeInTheDocument();
      expect(screen.getByText('Continuer').closest('button')).toBeDisabled();

      const radios = screen.getAllByRole('radio');
      fireEvent.click(radios[0]);
      expect(screen.getByText('Continuer').closest('button')).toBeEnabled();
      clickContinue();

      await waitFor(() =>
        expect(mockSubmit).toHaveBeenCalledWith('c1', {
          perceivedBenefits: ['FIND_JOB_INTERNSHIP_OR_APPRENTICESHIP'],
          employmentType: expect.any(String),
        })
      );
    });

    it('drops the employment type question when "find a job" is deselected', async () => {
      await toBenefits();
      const option = screen.getByText(
        'Trouver un emploi, un stage ou une alternance'
      );
      fireEvent.click(option);
      expect(screen.getByText("De quoi s'agit-il ?")).toBeInTheDocument();
      fireEvent.click(option);

      expect(screen.queryByText("De quoi s'agit-il ?")).not.toBeInTheDocument();
    });

    it('makes "nothing yet" exclusive with the other benefits', async () => {
      await toBenefits();
      fireEvent.click(screen.getByText('Trouver une formation'));
      fireEvent.click(screen.getByText('Avoir un soutien moral'));
      fireEvent.click(screen.getByText('Rien de concret pour l’instant'));
      clickContinue();

      await waitFor(() =>
        expect(mockSubmit).toHaveBeenCalledWith('c1', {
          perceivedBenefits: ['NOTHING_YET'],
        })
      );
    });

    it('removes "nothing yet" when another benefit is then selected', async () => {
      await toBenefits();
      fireEvent.click(screen.getByText('Rien de concret pour l’instant'));
      fireEvent.click(screen.getByText('Trouver une formation'));
      clickContinue();

      await waitFor(() =>
        expect(mockSubmit).toHaveBeenCalledWith('c1', {
          perceivedBenefits: ['FIND_TRAINING'],
        })
      );
    });
  });

  describe('rating, comment and final screens', () => {
    const toRating = async () => {
      mockGetCheckin.mockResolvedValue(
        state({
          checkin: {
            completedAt: null,
            stillInTouch: 'YES',
            exchangeModes: ['PHONE'],
            exchangeFrequency: 'WEEKLY',
            perceivedBenefits: ['FIND_TRAINING'],
            perceivedSupport: 'YES',
          },
        })
      );
      setup();
      await screen.findByText(
        'Comment noteriez-vous votre relation avec Marie ?'
      );
    };

    const rate = (stars: number) => {
      fireEvent.click(screen.getByLabelText(`Noter ${stars} sur 5`));
      clickContinue();
    };

    it('shows the high final screen for a rating of 4 or more', async () => {
      await toRating();
      rate(4);

      expect(await screen.findByTestId('final')).toHaveTextContent('high');
      expect(mockSubmit).toHaveBeenCalledWith('c1', { rating: 4 });
    });

    it('shows the medium final screen for a rating of 3', async () => {
      await toRating();
      rate(3);

      expect(await screen.findByTestId('final')).toHaveTextContent('medium');
    });

    it('asks for an optional comment for a rating of 2 or less, then shows the low final screen', async () => {
      await toRating();
      rate(2);

      expect(
        await screen.findByText('Voulez-vous nous en dire plus ?')
      ).toBeInTheDocument();
      expect(screen.getByText('Continuer').closest('button')).toBeDisabled();
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'Pas de réponse' },
      });
      clickContinue();

      await waitFor(() =>
        expect(mockSubmit).toHaveBeenLastCalledWith('c1', {
          comment: 'Pas de réponse',
        })
      );
      expect(await screen.findByTestId('final')).toHaveTextContent('low');
    });

    it('lets the user skip the comment', async () => {
      await toRating();
      rate(1);

      fireEvent.click(await screen.findByText('Passer cette question'));

      expect(await screen.findByTestId('final')).toHaveTextContent('low');
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
