import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { LinkedInMentionEditor } from '../LinkedInMentionEditor';

const MENTION = '@[Marie Dupont](urn:li:person:123)';

const getEditor = () => screen.getByRole('textbox');

/** Places a collapsed caret at the given container and offset. */
const placeCaret = (container: Node, offset: number) => {
  const range = document.createRange();
  range.setStart(container, offset);
  range.collapse(true);
  const selection = window.getSelection() as Selection;
  selection.removeAllRanges();
  selection.addRange(range);
};

describe('LinkedInMentionEditor', () => {
  it('renders plain text and line breaks from the initial text', () => {
    render(
      <LinkedInMentionEditor
        initialText={'Bonjour\nLe monde'}
        onChange={jest.fn()}
      />
    );
    const editor = getEditor();
    expect(editor).toHaveTextContent('BonjourLe monde');
    expect(editor.querySelectorAll('br')).toHaveLength(1);
  });

  it('renders mentions as non editable badges with a remove button', () => {
    render(
      <LinkedInMentionEditor
        initialText={`Merci ${MENTION} !`}
        onChange={jest.fn()}
      />
    );
    const badge = getEditor().querySelector('.mention-badge') as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.contentEditable).toBe('false');
    expect(badge.dataset.raw).toBe(MENTION);
    expect(badge).toHaveTextContent('Marie Dupont');
  });

  it('serializes the content (mentions as raw markup) on input', () => {
    const onChange = jest.fn();
    render(
      <LinkedInMentionEditor
        initialText={`Merci ${MENTION} !`}
        onChange={onChange}
      />
    );
    fireEvent.input(getEditor());
    expect(onChange).toHaveBeenCalledWith(`Merci ${MENTION} !`);
  });

  it('removes a mention with its × button and reports the new text', () => {
    const onChange = jest.fn();
    render(
      <LinkedInMentionEditor
        initialText={`A ${MENTION} B`}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(getEditor().querySelector('.mention-badge')).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith('A  B');
  });

  it('does not reinitialise the content when re-rendered', () => {
    const { rerender } = render(
      <LinkedInMentionEditor initialText="Un" onChange={jest.fn()} />
    );
    rerender(<LinkedInMentionEditor initialText="Deux" onChange={jest.fn()} />);
    expect(getEditor()).toHaveTextContent('Un');
    expect(getEditor()).not.toHaveTextContent('Deux');
  });

  it('uses the latest onChange callback', () => {
    const first = jest.fn();
    const second = jest.fn();
    const { rerender } = render(
      <LinkedInMentionEditor initialText="Un" onChange={first} />
    );
    rerender(<LinkedInMentionEditor initialText="Un" onChange={second} />);
    fireEvent.input(getEditor());
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('Un');
  });

  it('inserts a line break on Enter instead of a block', () => {
    const onChange = jest.fn();
    render(<LinkedInMentionEditor initialText="Salut" onChange={onChange} />);
    const editor = getEditor();
    placeCaret(editor.firstChild as Node, 5);
    fireEvent.keyDown(editor, { key: 'Enter' });
    expect(editor.querySelectorAll('br')).toHaveLength(1);
    expect(onChange).toHaveBeenLastCalledWith('Salut\n');
  });

  it('ignores Enter when there is no selection', () => {
    const onChange = jest.fn();
    render(<LinkedInMentionEditor initialText="Salut" onChange={onChange} />);
    (window.getSelection() as Selection).removeAllRanges();
    fireEvent.keyDown(getEditor(), { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('removes the mention before the caret on Backspace', () => {
    const onChange = jest.fn();
    render(
      <LinkedInMentionEditor
        initialText={`${MENTION} suite`}
        onChange={onChange}
      />
    );
    const editor = getEditor();
    const textAfter = editor.lastChild as Node;
    placeCaret(textAfter, 0);
    fireEvent.keyDown(editor, { key: 'Backspace' });
    expect(editor.querySelector('.mention-badge')).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith(' suite');
  });

  it('removes the mention when the caret is on the editor itself on Backspace', () => {
    const onChange = jest.fn();
    render(
      <LinkedInMentionEditor initialText={`${MENTION}`} onChange={onChange} />
    );
    const editor = getEditor();
    const badgeIndex = Array.from(editor.childNodes).findIndex(
      (n) => (n as HTMLElement).dataset?.raw
    );
    placeCaret(editor, badgeIndex + 1);
    fireEvent.keyDown(editor, { key: 'Backspace' });
    expect(editor.querySelector('.mention-badge')).toBeNull();
  });

  it('removes the mention after the caret on Delete', () => {
    const onChange = jest.fn();
    render(
      <LinkedInMentionEditor
        initialText={`avant ${MENTION}`}
        onChange={onChange}
      />
    );
    const editor = getEditor();
    const textBefore = editor.firstChild as Node;
    placeCaret(textBefore, (textBefore.textContent ?? '').length);
    fireEvent.keyDown(editor, { key: 'Delete' });
    expect(editor.querySelector('.mention-badge')).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith('avant ');
  });

  it('removes the mention when the caret is on the editor on Delete', () => {
    render(
      <LinkedInMentionEditor initialText={MENTION} onChange={jest.fn()} />
    );
    const editor = getEditor();
    const badgeIndex = Array.from(editor.childNodes).findIndex(
      (n) => (n as HTMLElement).dataset?.raw
    );
    placeCaret(editor, badgeIndex);
    fireEvent.keyDown(editor, { key: 'Delete' });
    expect(editor.querySelector('.mention-badge')).toBeNull();
  });

  it('leaves normal deletions to the browser when the caret is not next to a mention', () => {
    const onChange = jest.fn();
    render(
      <LinkedInMentionEditor
        initialText={`abc ${MENTION}`}
        onChange={onChange}
      />
    );
    const editor = getEditor();
    placeCaret(editor.firstChild as Node, 1);
    fireEvent.keyDown(editor, { key: 'Backspace' });
    fireEvent.keyDown(editor, { key: 'Delete' });
    expect(editor.querySelector('.mention-badge')).not.toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not remove a mention when a range is selected', () => {
    render(
      <LinkedInMentionEditor
        initialText={`a ${MENTION}`}
        onChange={jest.fn()}
      />
    );
    const editor = getEditor();
    const range = document.createRange();
    range.setStart(editor.firstChild as Node, 0);
    range.setEnd(editor.firstChild as Node, 1);
    const selection = window.getSelection() as Selection;
    selection.removeAllRanges();
    selection.addRange(range);
    fireEvent.keyDown(editor, { key: 'Backspace' });
    expect(editor.querySelector('.mention-badge')).not.toBeNull();
  });

  it('ignores other keys', () => {
    const onChange = jest.fn();
    render(<LinkedInMentionEditor initialText="x" onChange={onChange} />);
    act(() => {
      fireEvent.keyDown(getEditor(), { key: 'a' });
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
