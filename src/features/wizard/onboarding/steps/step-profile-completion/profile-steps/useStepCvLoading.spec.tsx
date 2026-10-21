jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('./CvLoadingAnimation', () => ({
  CvLoadingAnimation: () => <div data-testid="cv-loading" />,
}));
jest.mock('../ProfileLivePreview/ProfileLivePreviewPanel', () => ({
  ProfileLivePreviewPanel: () => <div data-testid="live-preview" />,
}));

import { render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { useStepCvLoading } from './useStepCvLoading';

describe('useStepCvLoading', () => {
  it('describes a headerless, non skippable loading step', async () => {
    const onManualFallback = jest.fn();
    const { result } = renderHook(() => useStepCvLoading({ onManualFallback }));
    const step = result.current.onboardingStepCvLoading;
    expect(step.id).toBe('cv-loading');
    expect(step.hideGenericStepHeader).toBe(true);
    expect(step.isNextEnabled).toBe(false);
    expect(await step.isStepCompleted?.()).toBe(true);
    expect((step.content as any).props.onManualFallback).toBe(onManualFallback);
    render(<>{step.content}</>);
    expect(screen.getByTestId('cv-loading')).toBeInTheDocument();
    render(<>{step.sidePanelContent?.({} as any)}</>);
    expect(screen.getByTestId('live-preview')).toBeInTheDocument();
  });
});
