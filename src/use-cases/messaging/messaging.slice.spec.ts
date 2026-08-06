// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { slice } from './messaging.slice';

const { actions, reducer } = slice;

describe('messaging slice', () => {
  describe('plain reducers', () => {
    it('selectConversation sets selectedConversationId', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.selectConversation('conv-1')
      );

      expect(state.selectedConversationId).toBe('conv-1');
    });

    it('setQuery sets query', () => {
      const state = reducer(slice.getInitialState(), actions.setQuery('hi'));

      expect(state.query).toBe('hi');
    });

    it('setPinnedInfo sets pinnedInfo', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.setPinnedInfo('ADDRESSEE_UNAVAILABLE')
      );

      expect(state.pinnedInfo).toBe('ADDRESSEE_UNAVAILABLE');
    });

    it('setNewMessage sets newMessage', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.setNewMessage('draft text')
      );

      expect(state.newMessage).toBe('draft text');
    });

    it('setIsAIPanelOpen sets isAIPanelOpen', () => {
      const state = reducer(
        slice.getInitialState(),
        actions.setIsAIPanelOpen(true)
      );

      expect(state.isAIPanelOpen).toBe(true);
    });

    it('setActivePanelView sets the active view and opens the AI panel', () => {
      const initialState = {
        ...slice.getInitialState(),
        isAIPanelOpen: false,
      };

      const state = reducer(initialState, actions.setActivePanelView('ai'));

      expect(state.activePanelView).toBe('ai');
      expect(state.isAIPanelOpen).toBe(true);
    });
  });
});
