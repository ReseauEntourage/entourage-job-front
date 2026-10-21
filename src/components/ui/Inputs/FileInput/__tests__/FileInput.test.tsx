import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { FileTypes } from '@/src/features/forms/FormSchema';
import { FileInput } from '../FileInput';
import { FilePreviewCV } from '../FilePreview/FilePreviewCV';
import { FilePreviewLogo } from '../FilePreview/FilePreviewLogo';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

const baseProps = {
  id: 'file',
  name: 'file',
  title: 'Fichier',
  value: null,
  accept: '.pdf',
  onChange: jest.fn(),
};

const selectFiles = (files: File[]) =>
  fireEvent.change(screen.getByTestId('file'), { target: { files } });

describe('FileInput', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the default activator and a labelled hidden input', () => {
    render(<FileInput {...baseProps} showLabel />);
    expect(screen.getByRole('button', { name: 'Télécharger' })).toBeVisible();
    expect(screen.getByText('Fichier')).toBeInTheDocument();
    expect(screen.getByTestId('file')).toHaveAttribute('accept', '.pdf');
  });

  it('opens the native picker through the default activator', () => {
    render(<FileInput {...baseProps} />);
    const click = jest.spyOn(screen.getByTestId('file'), 'click');
    fireEvent.click(screen.getByRole('button', { name: 'Télécharger' }));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('uses a custom activator instead of the default one', () => {
    render(<FileInput {...baseProps} activator={<span>Choisir</span>} />);
    expect(screen.getByText('Choisir')).toBeInTheDocument();
    expect(screen.queryByText('Télécharger')).not.toBeInTheDocument();
  });

  it('calls onChange with the selected files', () => {
    render(<FileInput {...baseProps} />);
    const file = new File(['x'], 'cv.pdf', { type: 'application/pdf' });
    selectFiles([file]);
    expect(baseProps.onChange).toHaveBeenCalledWith([file]);
  });

  it('shows a CV preview that removes the file', () => {
    render(
      <FileInput
        {...baseProps}
        value={[new File(['x'], 'cv.pdf')]}
        fileType={FileTypes.CV}
      />
    );
    expect(screen.getByText('Votre CV')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('file-input-preview-cv-delete'));
    expect(baseProps.onChange).toHaveBeenCalledWith(null);
  });

  it('shows a logo preview with the generic name, then the picked file name', () => {
    const file = new File(['x'], 'logo.png');
    render(<FileInput {...baseProps} value={file} fileType={FileTypes.LOGO} />);
    expect(screen.getByText('Votre logo')).toBeInTheDocument();
    selectFiles([file]);
    expect(screen.getByText('logo.png')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('file-input-preview-logo-delete'));
    expect(baseProps.onChange).toHaveBeenLastCalledWith(null);
  });

  it('hides the preview with noPreview', () => {
    render(
      <FileInput
        {...baseProps}
        value={[new File(['x'], 'cv.pdf')]}
        fileType={FileTypes.CV}
        noPreview
      />
    );
    expect(screen.queryByText('Votre CV')).not.toBeInTheDocument();
  });

  it('shows errors, is disabled on demand and renders nothing when hidden', () => {
    const { rerender, container } = render(
      <FileInput
        {...baseProps}
        disabled
        error={{ type: 'required', message: 'Fichier requis' }}
      />
    );
    expect(screen.getByText('Fichier requis')).toBeInTheDocument();
    expect(screen.getByTestId('file')).toBeDisabled();
    rerender(<FileInput {...baseProps} hidden />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('FilePreviews', () => {
  it('lets the CV preview open the file', () => {
    const onOpenFile = jest.fn();
    render(
      <FilePreviewCV
        filename="cv.pdf"
        onRemoveFile={jest.fn()}
        onOpenFile={onOpenFile}
        dataTestId="p"
      />
    );
    fireEvent.click(screen.getByText('cv.pdf'));
    expect(onOpenFile).toHaveBeenCalledTimes(1);
  });

  it('lets the logo preview open and remove the file', () => {
    const onOpenFile = jest.fn();
    const onRemoveFile = jest.fn();
    render(
      <FilePreviewLogo
        filename="logo.png"
        onRemoveFile={onRemoveFile}
        onOpenFile={onOpenFile}
        dataTestId="p"
      />
    );
    fireEvent.click(screen.getByText('logo.png'));
    fireEvent.click(screen.getByTestId('p-logo-delete'));
    expect(onOpenFile).toHaveBeenCalledTimes(1);
    expect(onRemoveFile).toHaveBeenCalledTimes(1);
  });
});
