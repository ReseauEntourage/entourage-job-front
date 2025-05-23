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

export interface OffcanvasRef {
  open: () => void;
}

interface OffcanvasProps {
  children: React.ReactNode;
  position?: 'left' | 'right';
}

export const Offcanvas = forwardRef<OffcanvasRef, OffcanvasProps>(
  ({ children, position = 'left' }, ref) => {
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
        <CloseButton onClick={closeOffCanvas} />
        {children}
      </StyledOffCanvas>
    );
  }
);
