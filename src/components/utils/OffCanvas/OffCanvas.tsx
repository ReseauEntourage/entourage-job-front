import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { CloseButton } from 'src/components/utils/CloseButton/CloseButton';
import { StyledOffCanvas } from './OffCanvas.styles';

export interface OffCanvasRef {
  open: () => void;
  close: () => void;
}

interface OffCanvasProps {
  children: React.ReactNode;
  position?: 'left' | 'right';
  closeButtonSize?: number;
}

export const OffCanvas = forwardRef<OffCanvasRef, OffCanvasProps>(
  ({ children, position = 'left', closeButtonSize }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const offCanvasRef = useRef<HTMLElement>(null);

    const closeOffCanvas = useCallback(() => {
      setIsOpen(false);
    }, []);

    const openOffCanvas = useCallback(() => {
      setIsOpen(true);
    }, []);

    useImperativeHandle(ref, () => ({
      open: openOffCanvas,
      close: closeOffCanvas,
    }));

    useEffect(() => {
      const handleOutSideClick = (event) => {
        if (
          isOpen &&
          offCanvasRef.current &&
          !offCanvasRef.current.contains(event.target)
        ) {
          closeOffCanvas();
        }
      };

      window.addEventListener('mousedown', handleOutSideClick);
      return () => {
        window.removeEventListener('mousedown', handleOutSideClick);
      };
    }, [isOpen, closeOffCanvas]);

    return (
      <StyledOffCanvas position={position} isOpen={isOpen} ref={offCanvasRef}>
        <CloseButton
          onClick={closeOffCanvas}
          color="white"
          size={closeButtonSize}
        />
        {children}
      </StyledOffCanvas>
    );
  }
);
