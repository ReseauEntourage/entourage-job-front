import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ElearningUnitVideo } from './ElearningUnitVideo';

jest.mock('react-lite-youtube-embed', () => ({
  __esModule: true,
  default: (props: any) => (
    <div
      data-testid="youtube"
      data-id={props.id}
      data-title={props.title}
      data-ratio={`${props.aspectWidth}x${props.aspectHeight}`}
    >
      <button onClick={props.onPlay}>play</button>
    </div>
  ),
}));

describe('ElearningUnitVideo', () => {
  it('embeds the YouTube video identified by the v parameter, ignoring other parameters', () => {
    render(
      <ElearningUnitVideo
        title="Intro"
        videoUrl="https://www.youtube.com/watch?v=abc123&t=42s"
      />
    );

    const embed = screen.getByTestId('youtube');
    expect(embed).toHaveAttribute('data-id', 'abc123');
    expect(embed).toHaveAttribute('data-title', 'Intro');
    expect(embed).toHaveAttribute('data-ratio', '16x9');
  });

  it('embeds a YouTube Short in portrait ratio', () => {
    render(
      <ElearningUnitVideo
        title="Short"
        videoUrl="https://www.youtube.com/shorts/short42"
      />
    );

    const embed = screen.getByTestId('youtube');
    expect(embed).toHaveAttribute('data-id', 'short42');
    expect(embed).toHaveAttribute('data-ratio', '9x16');
  });

  [undefined, null, '', 'https://example.com/video'].forEach((videoUrl) => {
    it(`says the video is unavailable for ${JSON.stringify(videoUrl)}`, () => {
      render(<ElearningUnitVideo title="x" videoUrl={videoUrl} />);

      expect(screen.getByText('Vidéo non disponible')).toBeInTheDocument();
      expect(screen.queryByTestId('youtube')).not.toBeInTheDocument();
    });
  });

  it('notifies when the video starts playing', () => {
    const onPlay = jest.fn();
    render(
      <ElearningUnitVideo
        title="x"
        videoUrl="https://youtube.com/watch?v=a"
        onPlay={onPlay}
      />
    );
    screen.getByText('play').click();

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('does not fail when no onPlay handler is given', () => {
    render(
      <ElearningUnitVideo title="x" videoUrl="https://youtube.com/watch?v=a" />
    );

    expect(() => screen.getByText('play').click()).not.toThrow();
  });
});
