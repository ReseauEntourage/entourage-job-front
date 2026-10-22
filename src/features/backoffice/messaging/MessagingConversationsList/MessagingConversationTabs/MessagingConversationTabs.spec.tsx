import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { MessagingConversationTabs } from './MessagingConversationTabs';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('MessagingConversationTabs', () => {
  it('shows the bare labels until the counts are known', () => {
    render(
      <MessagingConversationTabs activeTab="all" onTabChange={jest.fn()} />
    );
    expect(screen.getByTestId('messaging-tab-all')).toHaveTextContent(
      /^En cours$/
    );
    expect(screen.getByTestId('messaging-tab-unread')).toHaveTextContent(
      /^Non lues$/
    );
    expect(screen.getByTestId('messaging-tab-archived')).toHaveTextContent(
      /^Archivées$/
    );
  });

  it('shows each count, zero included', () => {
    render(
      <MessagingConversationTabs
        activeTab="all"
        counts={{ all: 4, unread: 0, archived: 2 }}
        onTabChange={jest.fn()}
      />
    );
    expect(screen.getByTestId('messaging-tab-all')).toHaveTextContent(
      'En cours · 4'
    );
    expect(screen.getByTestId('messaging-tab-unread')).toHaveTextContent(
      'Non lues · 0'
    );
    expect(screen.getByTestId('messaging-tab-archived')).toHaveTextContent(
      'Archivées · 2'
    );
  });

  it('reports the clicked tab', () => {
    const onTabChange = jest.fn();
    render(
      <MessagingConversationTabs activeTab="all" onTabChange={onTabChange} />
    );
    fireEvent.click(screen.getByTestId('messaging-tab-unread'));
    expect(onTabChange).toHaveBeenLastCalledWith('unread');
    fireEvent.click(screen.getByTestId('messaging-tab-archived'));
    expect(onTabChange).toHaveBeenLastCalledWith('archived');
    fireEvent.click(screen.getByTestId('messaging-tab-all'));
    expect(onTabChange).toHaveBeenLastCalledWith('all');
  });
});
