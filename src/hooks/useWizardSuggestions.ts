import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from 'src/api';
import { ProfileRecommendation } from 'src/api/types';
import { getPusher, PUSHER_CHANNELS, PUSHER_EVENTS } from 'src/constants';
import {
  selectWizardPanelState,
  selectWizardSuggestions,
  wizardActions,
} from 'src/use-cases/wizard';
import { SuggestedProfile } from 'src/use-cases/wizard/wizard.types';

const PUSHER_FALLBACK_DELAY_MS = 30_000;

/**
 * Subscribe to the wizard suggestions Pusher channel for a given user.
 * Transitions the panel from 'loading' to 'results' when embeddings are ready.
 * Falls back to a REST call if no Pusher event arrives within 30 seconds.
 * @param userId - The authenticated user's ID
 */
export const useWizardSuggestions = (userId: string | null) => {
  const dispatch = useDispatch();
  const panelState = useSelector(selectWizardPanelState);
  const suggestions = useSelector(selectWizardSuggestions);

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusher();
    const channel = pusher.subscribe(
      `${PUSHER_CHANNELS.WIZARD_SUGGESTIONS}-${userId}`
    );

    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const onSuggestionsReady = (data: { profiles: SuggestedProfile[] }) => {
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      dispatch(wizardActions.setSuggestions(data.profiles));
      dispatch(wizardActions.setPanelState('results'));
    };

    channel.bind(PUSHER_EVENTS.WIZARD_SUGGESTIONS_READY, onSuggestionsReady);

    if (panelState === 'loading') {
      fallbackTimer = setTimeout(async () => {
        try {
          const response = await Api.getUserProfileRecommendations({});
          const profiles: SuggestedProfile[] = (
            (response.data?.recommendations ?? []) as ProfileRecommendation[]
          )
            .slice(0, 5)
            .map((r) => ({
              userId: r.publicProfile.id,
              firstName: r.publicProfile.firstName,
              lastName: r.publicProfile.lastName,
              city: r.publicProfile.department ?? null,
              isAvailable: r.publicProfile.isAvailable,
              mainSector:
                r.publicProfile.sectorOccupations?.[0]?.businessSector?.name ??
                null,
            }));
          dispatch(wizardActions.setSuggestions(profiles));
          dispatch(wizardActions.setPanelState('results'));
        } catch {
          // Silently fail — panel stays in loading state
        }
      }, PUSHER_FALLBACK_DELAY_MS);
    }

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      channel.unbind(PUSHER_EVENTS.WIZARD_SUGGESTIONS_READY, onSuggestionsReady);
      pusher.unsubscribe(`${PUSHER_CHANNELS.WIZARD_SUGGESTIONS}-${userId}`);
    };
  }, [userId, panelState, dispatch]);

  const triggerLoading = () => {
    dispatch(wizardActions.setPanelState('loading'));
  };

  return { panelState, suggestions, triggerLoading };
};
