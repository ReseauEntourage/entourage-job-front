import { useCallback } from 'react';

export const useOffCanvas = (offCanvasRef) => {
  const closeOffCanvas = useCallback(() => {
    if (offCanvasRef.current) {
      offCanvasRef.current.close();
    }
  }, [offCanvasRef]);

  const openOffCanvas = useCallback(() => {
    if (offCanvasRef.current) {
      offCanvasRef.current.open();
    }
  }, [offCanvasRef]);

  return { closeOffCanvas, openOffCanvas };
};
