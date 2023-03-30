import { useCallback, useEffect, useState } from 'react';
import { isSSR } from 'src/utils/isSSR';

export function useCloseOnClickOutsideComponent(id) {
  const [isOpen, setIsOpen] = useState(false);

  const componentId = `${id}-container`;

  const closeSelect = useCallback(
    (e) => {
      const container = document.getElementById(componentId);
      e.preventDefault();
      const isClickInside = container.contains(e.target);
      if (isOpen && !isClickInside) {
        setIsOpen(false);
      }
    },
    [componentId, isOpen]
  );

  useEffect(() => {
    if (!isSSR && id) {
      document.addEventListener('click', closeSelect);
      return () => {
        document.removeEventListener('click', closeSelect);
      };
    }
  }, [closeSelect, id]);

  return { componentId, isOpen, setIsOpen };
}
