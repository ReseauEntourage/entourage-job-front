import { useCallback, useEffect, useState } from 'react';

export function useCloseOnClickOutsideComponent(id: string) {
  const [isOpen, setIsOpen] = useState(false);

  const componentId = `${id}-container`;

  const closeSelect = useCallback(
    (e) => {
      e.preventDefault();
      const container = document.getElementById(componentId);
      const isClickInside = container?.contains(e.target);
      if (isOpen && !isClickInside) {
        setIsOpen(false);
      }
    },
    [componentId, isOpen]
  );

  useEffect(() => {
    if (id) {
      document.addEventListener('click', closeSelect);
      return () => {
        document.removeEventListener('click', closeSelect);
      };
    }
  }, [closeSelect, id]);

  return { componentId, isOpen, setIsOpen };
}
