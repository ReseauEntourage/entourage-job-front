import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '@/src/constants/styles';
import { ButtonIcon } from 'src/components/ui/Button/ButtonIcon';
import { LucidIcon } from 'src/components/ui/Icons/LucidIcon';
import {
  messagingActions,
  selectActivePanelView,
} from 'src/use-cases/messaging';
import type { MessagingPanelView } from 'src/use-cases/messaging/messaging.slice';
import { MessagingAIAssistant } from './MessagingAIAssistant';
import {
  AIPanelContainer,
  AIPanelHeader,
  PanelTab,
  PanelTabBar,
} from './MessagingAIPanel.styles';

interface PanelTabConfig {
  view: MessagingPanelView;
  label: string;
  icon: string;
}

const PANEL_TABS: PanelTabConfig[] = [
  { view: 'ai', label: 'Assistant IA', icon: 'Sparkles' },
];

export const MessagingAIPanel = () => {
  const dispatch = useDispatch();
  const activePanelView = useSelector(selectActivePanelView);

  const onClose = () => {
    dispatch(messagingActions.setIsAIPanelOpen(false));
  };

  const onSelectTab = (view: MessagingPanelView) => {
    dispatch(messagingActions.setActivePanelView(view));
  };

  return (
    <AIPanelContainer>
      <AIPanelHeader>
        <PanelTabBar>
          {PANEL_TABS.map((tab) => (
            <PanelTab
              key={tab.view}
              isActive={activePanelView === tab.view}
              onClick={() => onSelectTab(tab.view)}
            >
              <LucidIcon name={tab.icon as any} size={14} />
              {tab.label}
            </PanelTab>
          ))}
        </PanelTabBar>
        <ButtonIcon
          icon={<LucidIcon name="X" size={18} />}
          onClick={onClose}
          color={COLORS.mediumGray}
        />
      </AIPanelHeader>

      {activePanelView === 'ai' && <MessagingAIAssistant />}
    </AIPanelContainer>
  );
};
