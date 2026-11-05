jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/profile/ai/AiLegalMention', () => ({
  AiLegalMention: () => <div data-testid="legal-mention" />,
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { StepCvChoiceContent } from './StepCvChoiceContent';

const pdf = new File(['pdf'], 'cv.pdf', { type: 'application/pdf' });
const png = new File(['png'], 'cv.png', { type: 'image/png' });

function setup() {
  const onCvSelected = jest.fn();
  const onManualChoice = jest.fn();
  const { container } = render(
    <StepCvChoiceContent
      onCvSelected={onCvSelected}
      onManualChoice={onManualChoice}
    />
  );
  const input = container.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  return { onCvSelected, onManualChoice, input, container };
}

describe('StepCvChoiceContent', () => {
  afterEach(() => cleanup());

  it('offers the two ways to build the profile and the legal mention', () => {
    setup();
    expect(
      screen.getByText('Importer mon CV', { selector: 'button *, button' })
    ).toBeInTheDocument();
    expect(screen.getByText('Le remplir moi-même')).toBeInTheDocument();
    expect(screen.getByTestId('legal-mention')).toBeInTheDocument();
  });

  it('chooses the manual path', () => {
    const { onManualChoice } = setup();
    fireEvent.click(screen.getByText('Le remplir moi-même'));
    expect(onManualChoice).toHaveBeenCalledTimes(1);
  });

  it('opens the file picker from the button and from the drop zone', () => {
    const { input } = setup();
    const click = jest.spyOn(input, 'click');
    fireEvent.click(
      screen.getAllByText('Importer mon CV').find((el) => el.closest('button'))!
    );
    expect(click).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText(/Le plus rapide/));
    expect(click).toHaveBeenCalledTimes(2);
  });

  it('sends a PDF picked with the file input as form data and resets the input', () => {
    const { input, onCvSelected } = setup();
    fireEvent.change(input, { target: { files: [pdf] } });
    expect(onCvSelected).toHaveBeenCalledTimes(1);
    const formData = onCvSelected.mock.calls[0][0] as FormData;
    expect((formData.get('file') as File).name).toBe('cv.pdf');
    expect(input.value).toBe('');
  });

  it('ignores files that are not PDFs and empty selections', () => {
    const { input, onCvSelected } = setup();
    fireEvent.change(input, { target: { files: [png] } });
    fireEvent.change(input, { target: { files: [] } });
    expect(onCvSelected).not.toHaveBeenCalled();
  });

  it('accepts a PDF dropped on the zone, and highlights the zone while dragging', () => {
    const { onCvSelected } = setup();
    const zone = screen.getByText(/Le plus rapide/)
      .parentElement as HTMLElement;
    fireEvent.dragOver(zone);
    fireEvent.dragLeave(zone);
    fireEvent.dragOver(zone);
    fireEvent.drop(zone, { dataTransfer: { files: [pdf] } });
    expect(onCvSelected).toHaveBeenCalledTimes(1);
  });

  it('ignores a dropped image or an empty drop', () => {
    const { onCvSelected } = setup();
    const zone = screen.getByText(/Le plus rapide/)
      .parentElement as HTMLElement;
    fireEvent.drop(zone, { dataTransfer: { files: [png] } });
    fireEvent.drop(zone, { dataTransfer: { files: [] } });
    expect(onCvSelected).not.toHaveBeenCalled();
  });
});
