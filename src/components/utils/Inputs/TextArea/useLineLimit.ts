import { useWindowWidth } from '@react-hook/window-size';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrevious } from 'src/hooks/utils';

export function useLineLimit(
  value: string,
  name: string,
  onChange: (updatedValue: string) => void,
  maxLines?: number
) {
  const windowWidth = useWindowWidth();

  const [numberOfLines, setNumberOfLines] = useState(0);
  const [textAreaWidth, setTextAreaWidth] = useState(0);

  const ref = useRef<HTMLTextAreaElement>();

  const prevValue: string = usePrevious(value);

  const calculateContentHeight = useCallback((ta, scanAmount) => {
    const origHeight = ta.style.height;
    let height = ta.offsetHeight;
    const { scrollHeight } = ta;
    const { overflow } = ta.style;
    /// only bother if the ta is bigger than content
    if (height >= scrollHeight) {
      /// check that our browser supports changing dimension
      /// calculations mid-way through a function call...
      ta.style.height = `${height + scanAmount}px`;
      /// because the scrollbar can cause calculation problems
      ta.style.overflow = 'hidden';
      /// by checking that scrollHeight has updated
      if (scrollHeight < ta.scrollHeight) {
        /// now try and scan the ta's height downwards
        /// until scrollHeight becomes larger than height
        while (ta.offsetHeight >= ta.scrollHeight) {
          ta.style.height = `${(height -= scanAmount)}px`;
        }
        /// be more specific to get the exact height
        while (ta.offsetHeight < ta.scrollHeight) {
          ta.style.height = `${(height += 1)}px`;
        }
        /// reset the ta back to it's original height
        ta.style.height = origHeight;
        /// put the overflow back
        ta.style.overflow = overflow;
        return height;
      }
    } else {
      return scrollHeight;
    }
  }, []);

  const maxLinesReached = maxLines - numberOfLines < 0;

  const remainingLines = maxLines - numberOfLines;

  useEffect(() => {
    if (maxLines && ref && ref.current && value !== prevValue) {
      const ta = ref.current;

      const style = window.getComputedStyle
        ? window.getComputedStyle(ta)
        : ta.style;

      const taLineHeight = parseInt(style.lineHeight, 10);
      const taPaddingBottom = parseInt(style.paddingBottom, 10);
      const taPaddingTop = parseInt(style.paddingTop, 10);
      const taHeight = calculateContentHeight(ta, taLineHeight);

      const nbOfLines = Math.ceil(
        (taHeight - taPaddingBottom - taPaddingTop) / taLineHeight
      );
      setNumberOfLines(!value ? 0 : nbOfLines);
    }
  }, [calculateContentHeight, maxLines, name, onChange, prevValue, ref, value]);

  useEffect(() => {
    const modal = document.getElementById('modal-screen')
      ?.firstElementChild as HTMLElement;

    if (modal) {
      const modalStyle = window.getComputedStyle
        ? window.getComputedStyle(modal)
        : modal.style;

      const modalBody = document.getElementById('modal-generic')
        ?.firstElementChild as HTMLElement;

      if (modalBody) {
        const modalBodyStyle = window.getComputedStyle
          ? window.getComputedStyle(modalBody)
          : modalBody.style;

        const width =
          windowWidth -
          parseInt(modalStyle.marginLeft, 10) -
          parseInt(modalStyle.marginRight, 10) -
          parseInt(modalBodyStyle.paddingLeft, 10) -
          parseInt(modalBodyStyle.paddingRight, 10);

        setTextAreaWidth(width);
      }
    }
  }, [windowWidth]);

  return { remainingLines, maxLinesReached, textAreaRef: ref, textAreaWidth };
}
